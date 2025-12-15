import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { Node } from "@xyflow/react";
import { CustomNodeData } from "@/app/(platform)/build/components/legacy-builder/CustomNode/CustomNode";
import {
  BlockUIType,
  CredentialsMetaInput,
  GraphMeta,
} from "@/lib/autogpt-server-api/types";
import RunnerOutputUI, { OutputNodeInfo } from "./RunnerOutputUI";
import { RunnerInputDialog } from "./RunnerInputUI";

interface RunnerUIWrapperProps {
  graph: GraphMeta;
  nodes: Node<CustomNodeData>[];
  graphExecutionError?: string | null;
  saveAndRun: (
    inputs: Record<string, any>,
    credentialsInputs: Record<string, CredentialsMetaInput>,
  ) => void;
  createRunSchedule: (
    cronExpression: string,
    scheduleName: string,
    inputs: Record<string, any>,
    credentialsInputs: Record<string, CredentialsMetaInput>,
  ) => Promise<void>;
}

export interface RunnerUIWrapperRef {
  openRunInputDialog: () => void;
  openRunnerOutput: () => void;
  runOrOpenInput: () => void;
}

const RunnerUIWrapper = forwardRef<RunnerUIWrapperRef, RunnerUIWrapperProps>(
  (
    { graph, nodes, graphExecutionError, saveAndRun, createRunSchedule },
    ref,
  ) => {
    const [isRunInputDialogOpen, setIsRunInputDialogOpen] = useState(false);
    const [isRunnerOutputOpen, setIsRunnerOutputOpen] = useState(false);

    const graphInputs = graph.input_schema.properties;

    const graphOutputs = useMemo((): OutputNodeInfo[] => {
      const outputNodes = nodes.filter(
        (node) => node.data.uiType === BlockUIType.OUTPUT,
      );

      return outputNodes.map(
        (node) =>
          ({
            metadata: {
              name: node.data.hardcodedValues.name || "输出",
              description:
                node.data.hardcodedValues.description || "来自智能体的输出",
            },
            result:
              (node.data.executionResults as any)
                ?.map((result: any) => result?.data?.output)
                .join("\n--\n") || "暂无输出",
          }) satisfies OutputNodeInfo,
      );
    }, [nodes]);

    const openRunInputDialog = () => setIsRunInputDialogOpen(true);
    const openRunnerOutput = () => setIsRunnerOutputOpen(true);

    const runOrOpenInput = () => {
      if (
        Object.keys(graphInputs).length > 0 ||
        Object.keys(graph.credentials_input_schema.properties).length > 0
      ) {
        openRunInputDialog();
      } else {
        saveAndRun({}, {});
      }
    };

    useImperativeHandle(
      ref,
      () =>
        ({
          openRunInputDialog,
          openRunnerOutput,
          runOrOpenInput,
        }) satisfies RunnerUIWrapperRef,
    );

    return (
      <>
        <RunnerInputDialog
          isOpen={isRunInputDialogOpen}
          doClose={() => setIsRunInputDialogOpen(false)}
          graph={graph}
          doRun={saveAndRun}
          doCreateSchedule={createRunSchedule}
        />
        <RunnerOutputUI
          isOpen={isRunnerOutputOpen}
          doClose={() => setIsRunnerOutputOpen(false)}
          outputs={graphOutputs}
          graphExecutionError={graphExecutionError}
        />
      </>
    );
  },
);

RunnerUIWrapper.displayName = "RunnerUIWrapper";

export default RunnerUIWrapper;
