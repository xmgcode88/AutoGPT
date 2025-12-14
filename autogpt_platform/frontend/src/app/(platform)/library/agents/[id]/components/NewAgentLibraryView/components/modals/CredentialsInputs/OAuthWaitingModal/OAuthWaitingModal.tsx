import { Dialog } from "@/components/molecules/Dialog/Dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  providerName: string;
};

export function OAuthFlowWaitingModal({ open, onClose, providerName }: Props) {
  return (
    <Dialog
      title={`正在等待 ${providerName} 登录...`}
      controlled={{
        isOpen: open,
        set: (isOpen) => {
          if (!isOpen) onClose();
        },
      }}
      onClose={onClose}
    >
      <Dialog.Content>
        <p className="text-sm text-zinc-600">
          请在弹窗中完成登录流程。
          <br />
          关闭此对话框将取消登录流程。
        </p>
      </Dialog.Content>
    </Dialog>
  );
}
