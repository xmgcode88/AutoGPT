// Creating this hook, because we are using same saving stuff at multiple places in our builder

import { useCallback } from "react";
import { useToast } from "@/components/molecules/Toast/use-toast";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import {
  useGetV1GetSpecificGraph,
  usePostV1CreateNewGraph,
  usePutV1UpdateGraphVersion,
} from "@/app/api/__generated__/endpoints/graphs/graphs";
import { GraphModel } from "@/app/api/__generated__/models/graphModel";
import { Graph } from "@/app/api/__generated__/models/graph";
import { useNodeStore } from "../stores/nodeStore";
import { useEdgeStore } from "../stores/edgeStore";
import { graphsEquivalent } from "../components/NewControlPanel/NewSaveControl/helpers";
import { useGraphStore } from "../stores/graphStore";
import { useShallow } from "zustand/react/shallow";

export type SaveGraphOptions = {
  showToast?: boolean;
  onSuccess?: (graph: GraphModel) => void;
  onError?: (error: any) => void;
};

export const useSaveGraph = ({
  showToast = true,
  onSuccess,
  onError,
}: SaveGraphOptions) => {
  const { toast } = useToast();

  const [{ flowID, flowVersion }, setQueryStates] = useQueryStates({
    flowID: parseAsString,
    flowVersion: parseAsInteger,
  });

  const setGraphSchemas = useGraphStore(
    useShallow((state) => state.setGraphSchemas),
  );

  const { data: graph } = useGetV1GetSpecificGraph(
    flowID ?? "",
    flowVersion !== null ? { version: flowVersion } : {},
    {
      query: {
        select: (res) => res.data as GraphModel,
        enabled: !!flowID,
      },
    },
  );

  const { mutateAsync: createNewGraph, isPending: isCreating } =
    usePostV1CreateNewGraph({
      mutation: {
        onSuccess: (response) => {
          const data = response.data as GraphModel;
          setQueryStates({
            flowID: data.id,
            flowVersion: data.version,
          });
          onSuccess?.(data);
          if (showToast) {
            toast({
              title: "流程已保存",
              description: "流程已成功保存。",
              variant: "default",
            });
          }
        },
        onError: (error) => {
          onError?.(error);
          toast({
            title: "保存流程失败",
            description: (error as any).message ?? "发生未知错误。",
            variant: "destructive",
          });
        },
      },
    });

  const { mutateAsync: updateGraph, isPending: isUpdating } =
    usePutV1UpdateGraphVersion({
      mutation: {
        onSuccess: (response) => {
          const data = response.data as GraphModel;
          setQueryStates({
            flowID: data.id,
            flowVersion: data.version,
          });
          onSuccess?.(data);
          if (showToast) {
            toast({
              title: "流程已保存",
              description: "流程已成功保存。",
              variant: "default",
            });
          }
        },
        onError: (error) => {
          onError?.(error);
          toast({
            title: "保存流程失败",
            description: (error as any).message ?? "发生未知错误。",
            variant: "destructive",
          });
        },
      },
    });

  const saveGraph = useCallback(
    async (values?: { name?: string; description?: string }) => {
      const graphNodes = useNodeStore.getState().getBackendNodes();
      const graphLinks = useEdgeStore.getState().getBackendLinks();

      if (graph && graph.id) {
        const data: Graph = {
          id: graph.id,
          name:
            values?.name ||
            graph.name ||
            `新智能体 ${new Date().toISOString()}`,
          description: values?.description ?? graph.description ?? "",
          nodes: graphNodes,
          links: graphLinks,
        };

        if (graphsEquivalent(graph, data)) {
          if (showToast) {
            toast({
              title: "无变更可保存",
              description: "当前流程与已保存版本一致。",
              variant: "default",
            });
          }
          return;
        }

        const response = await updateGraph({ graphId: graph.id, data: data });
        const graphData = response.data as GraphModel;
        setGraphSchemas(
          graphData.input_schema,
          graphData.credentials_input_schema,
          graphData.output_schema,
        );
      } else {
        const data: Graph = {
          name: values?.name || `新智能体 ${new Date().toISOString()}`,
          description: values?.description || "",
          nodes: graphNodes,
          links: graphLinks,
        };

        const response = await createNewGraph({ data: { graph: data } });
        const graphData = response.data as GraphModel;
        setGraphSchemas(
          graphData.input_schema,
          graphData.credentials_input_schema,
          graphData.output_schema,
        );
      }
    },
    [graph, toast, createNewGraph, updateGraph],
  );

  return {
    saveGraph,
    isSaving: isCreating || isUpdating,
  };
};
