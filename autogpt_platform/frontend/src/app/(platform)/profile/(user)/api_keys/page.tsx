import { Metadata } from "next/types";
import { APIKeysSection } from "@/app/(platform)/profile/(user)/api_keys/components/APIKeySection/APIKeySection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/__legacy__/ui/card";
import { APIKeysModals } from "./components/APIKeysModals/APIKeysModals";

export const metadata: Metadata = { title: "API 密钥 - AutoGPT Platform" };

const ApiKeysPage = () => {
  return (
    <div className="w-full pr-4 pt-24 md:pt-0">
      <Card>
        <CardHeader>
          <CardTitle>AutoGPT Platform API 密钥</CardTitle>
          <CardDescription>
            管理您的 AutoGPT Platform API 密钥，用于程序化访问
          </CardDescription>
        </CardHeader>
        <CardContent>
          <APIKeysModals />
          <APIKeysSection />
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeysPage;
