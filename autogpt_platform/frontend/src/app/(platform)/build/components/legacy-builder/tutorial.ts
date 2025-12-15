import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import { Key, storage } from "@/services/storage/local-storage";
import { analytics } from "@/services/analytics";

export const startTutorial = (
  emptyNodeList: (forceEmpty: boolean) => boolean,
  setPinBlocksPopover: (value: boolean) => void,
  setPinSavePopover: (value: boolean) => void,
) => {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      cancelIcon: { enabled: true },
      scrollTo: { behavior: "smooth", block: "center" },
    },
  });

  // CSS classes for disabling and highlighting blocks
  const disableClass = "disable-blocks";
  const highlightClass = "highlight-block";
  let isConnecting = false;

  // Helper function to disable all blocks except the target block
  const disableOtherBlocks = (targetBlockSelector: string) => {
    document.querySelectorAll('[data-id^="block-card-"]').forEach((block) => {
      block.classList.toggle(disableClass, !block.matches(targetBlockSelector));
      block.classList.toggle(
        highlightClass,
        block.matches(targetBlockSelector),
      );
    });
  };

  // Helper function to enable all blocks
  const enableAllBlocks = () => {
    document.querySelectorAll('[data-id^="block-card-"]').forEach((block) => {
      block.classList.remove(disableClass, highlightClass);
    });
  };

  // Inject CSS for disabling and highlighting blocks
  const injectStyles = () => {
    const style = document.createElement("style");
    style.textContent = `
            .${disableClass} {
                pointer-events: none;
                opacity: 0.5;
            }
            .${highlightClass} {
                background-color: #ffeb3b;
                border: 2px solid #fbc02d;
                transition: background-color 0.3s, border-color 0.3s;
            }
        `;
    document.head.appendChild(style);
  };

  // Helper function to check if an element is present in the DOM
  const waitForElement = (selector: string): Promise<void> => {
    return new Promise((resolve) => {
      const checkElement = () => {
        if (document.querySelector(selector)) {
          resolve();
        } else {
          setTimeout(checkElement, 10);
        }
      };
      checkElement();
    });
  };

  // Function to detect the correct connection and advance the tour
  const detectConnection = () => {
    const checkForConnection = () => {
      const correctConnection = document.querySelector(
        '[data-testid^="rf__edge-"]',
      );
      if (correctConnection) {
        tour.show("press-run-again");
      } else {
        setTimeout(checkForConnection, 100);
      }
    };

    checkForConnection();
  };

  // Define state management functions to handle connection state
  function startConnecting() {
    isConnecting = true;
  }

  function stopConnecting() {
    isConnecting = false;
  }

  // Reset connection state when revisiting the step
  function resetConnectionState() {
    stopConnecting();
  }

  // Event handlers for mouse down and up to manage connection state
  function handleMouseDown() {
    startConnecting();
    setTimeout(() => {
      if (isConnecting) {
        tour.next();
      }
    }, 100);
  }
  // Event handler for mouse up to check if the connection was successful
  function handleMouseUp(event: { target: any }) {
    const target = event.target;
    const validConnectionPoint = document.querySelector(
      '[data-testid^="rf__node-"]:nth-child(2) [data-id$="-a-target"]',
    );

    if (validConnectionPoint && !validConnectionPoint.contains(target)) {
      setTimeout(() => {
        if (!document.querySelector('[data-testid^="rf__edge-"]')) {
          stopConnecting();
          tour.show("connect-blocks-output");
        }
      }, 200);
    } else {
      stopConnecting();
    }
  }

  // Define the fitViewToScreen function
  const fitViewToScreen = () => {
    const fitViewButton = document.querySelector(
      ".react-flow__controls-fitview",
    ) as HTMLButtonElement;
    if (fitViewButton) {
      fitViewButton.click();
    }
  };

  injectStyles();

  const warningText = emptyNodeList(false)
    ? ""
    : "<br/><br/><b>注意：点击“下一步”将开始教程，并清空当前流程。</b>";

  tour.addStep({
    id: "starting-step",
    title: "欢迎使用教程",
    text: `这是 AutoGPT 搭建器！${warningText}`,
    buttons: [
      {
        text: "跳过教程",
        action: () => {
          tour.cancel(); // Ends the tour
          storage.set(Key.SHEPHERD_TOUR, "skipped"); // Set the tutorial as skipped in local storage
        },
        classes: "shepherd-button-secondary", // Optionally add a class for styling the skip button differently
      },
      {
        text: "下一步",
        action: () => {
          emptyNodeList(true);
          tour.next();
        },
      },
    ],
  });

  tour.addStep({
    id: "open-block-step",
    title: "打开模块菜单",
    text: "请点击模块按钮以打开模块菜单。",
    attachTo: {
      element: '[data-id="blocks-control-popover-trigger"]',
      on: "right",
    },
    advanceOn: {
      selector: '[data-id="blocks-control-popover-trigger"]',
      event: "click",
    },
    buttons: [],
  });

  tour.addStep({
    id: "scroll-block-menu",
    title: "向下滚动或搜索",
    text: "在模块菜单中向下滚动或搜索 “Calculator Block”，然后点击该模块添加。",
    attachTo: {
      element: '[data-id="blocks-control-popover-content"]',
      on: "right",
    },
    buttons: [],
    beforeShowPromise: () =>
      waitForElement('[data-id="blocks-control-popover-content"]').then(() => {
        disableOtherBlocks(
          '[data-id="block-card-b1ab9b19-67a6-406d-abf5-2dba76d00c79"]',
        );
      }),
    advanceOn: {
      selector: '[data-id="block-card-b1ab9b19-67a6-406d-abf5-2dba76d00c79"]',
      event: "click",
    },
    when: {
      show: () => setPinBlocksPopover(true),
      hide: enableAllBlocks,
    },
  });

  tour.addStep({
    id: "focus-new-block",
    title: "新模块",
    text: "这是 Calculator Block！我们来看看它如何工作。",
    attachTo: { element: `[data-id="custom-node-1"]`, on: "left" },
    beforeShowPromise: () => waitForElement('[data-id="custom-node-1"]'),
    buttons: [
      {
        text: "下一步",
        action: tour.next,
      },
    ],
    when: {
      show: () => {
        setPinBlocksPopover(false);
        setTimeout(() => {
          fitViewToScreen();
        }, 100);
      },
    },
  });

  tour.addStep({
    id: "input-to-block",
    title: "模块输入",
    text: "这是模块的输入引脚。你可以在这里接入其他模块的输出；该模块接受数字作为输入。",
    attachTo: { element: '[data-nodeid="1"]', on: "left" },
    buttons: [
      {
        text: "上一步",
        action: tour.back,
      },
      {
        text: "下一步",
        action: tour.next,
      },
    ],
  });

  tour.addStep({
    id: "output-from-block",
    title: "模块输出",
    text: "这是模块的输出引脚。你可以将其连接到其他模块以传递输出。",
    attachTo: { element: '[data-handlepos="right"]', on: "right" },
    buttons: [
      {
        text: "上一步",
        action: tour.back,
      },
      {
        text: "下一步",
        action: tour.next,
      },
    ],
  });

  tour.addStep({
    id: "select-operation-and-input",
    title: "选择运算并输入数字",
    text: "选择要执行的数学运算，并在两个输入框中输入数字。",
    attachTo: { element: '[data-id="input-handles"]', on: "right" },
    buttons: [
      {
        text: "上一步",
        action: tour.back,
      },
      {
        text: "下一步",
        action: tour.next,
      },
    ],
  });

  tour.addStep({
    id: "press-initial-save-button",
    title: "点击保存",
    text: "在运行之前，需要先保存流程！",
    attachTo: {
      element: '[data-id="save-control-popover-trigger"]',
      on: "left",
    },
    advanceOn: {
      selector: '[data-id="save-control-popover-trigger"]',
      event: "click",
    },
    buttons: [
      {
        text: "上一步",
        action: tour.back,
      },
    ],
    when: {
      hide: () => setPinSavePopover(true),
    },
  });

  tour.addStep({
    id: "save-agent-details",
    title: "保存智能体",
    text: "为智能体输入名称（可选填写描述），然后点击“保存智能体”来保存流程。",
    attachTo: {
      element: '[data-id="save-control-popover-content"]',
      on: "top",
    },
    buttons: [],
    beforeShowPromise: () =>
      waitForElement('[data-id="save-control-popover-content"]'),
    advanceOn: {
      selector: '[data-id="save-control-save-agent"]',
      event: "click",
    },
    when: {
      hide: () => setPinSavePopover(false),
    },
  });

  tour.addStep({
    id: "press-run",
    title: "点击运行",
    text: "点击“运行”按钮开始你的第一个流程！",
    attachTo: {
      element: '[data-testid="primary-action-run-agent"]',
      on: "top",
    },
    advanceOn: {
      selector: '[data-testid="primary-action-run-agent"]',
      event: "click",
    },
    buttons: [],
    beforeShowPromise: () =>
      waitForElement('[data-testid="primary-action-run-agent"]'),
    when: {
      hide: () => {
        setTimeout(() => {
          fitViewToScreen();
        }, 500);
      },
    },
  });

  tour.addStep({
    id: "wait-for-processing",
    title: "处理中",
    text: "请等待模块处理完成...",
    attachTo: {
      element: '[data-id^="badge-"][data-id$="-QUEUED"]',
      on: "bottom",
    },
    buttons: [],
    beforeShowPromise: () =>
      waitForElement('[data-id^="badge-"][data-id$="-QUEUED"]').then(
        fitViewToScreen,
      ),
    when: {
      show: () => {
        waitForElement('[data-id^="badge-"][data-id$="-COMPLETED"]').then(
          () => {
            tour.next();
          },
        );
      },
    },
  });

  tour.addStep({
    id: "check-output",
    title: "查看输出",
    text: "在这里查看流程运行后的模块输出。",
    attachTo: { element: '[data-id="latest-output"]', on: "top" },
    beforeShowPromise: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          waitForElement('[data-id="latest-output"]').then(resolve);
        }, 100);
      }),
    buttons: [
      {
        text: "下一步",
        action: tour.next,
      },
    ],
    when: {
      show: () => {
        fitViewToScreen();
      },
    },
  });

  tour.addStep({
    id: "copy-paste-block",
    title: "复制并粘贴模块",
    text: "我们来复制这个模块。用鼠标点击并按住模块，然后按 Ctrl+C（Mac 为 Cmd+C）复制，再按 Ctrl+V（Mac 为 Cmd+V）粘贴。",
    attachTo: { element: '[data-testid^="rf__node-"]', on: "top" },
    buttons: [
      {
        text: "上一步",
        action: tour.back,
      },
    ],
    when: {
      show: () => {
        fitViewToScreen();
        waitForElement('[data-testid^="rf__node-"]:nth-child(2)').then(() => {
          tour.next();
        });
      },
    },
  });

  tour.addStep({
    id: "focus-second-block",
    title: "聚焦新模块",
    text: "这是你复制出来的 Calculator Block。现在把它移动到第一个模块旁边。",
    attachTo: { element: '[data-testid^="rf__node-"]:nth-child(2)', on: "top" },
    beforeShowPromise: () =>
      waitForElement('[data-testid^="rf__node-"]:nth-child(2)'),
    buttons: [
      {
        text: "下一步",
        action: tour.next,
      },
    ],
  });

  tour.addStep({
    id: "connect-blocks-output",
    title: "连接模块：输出",
    text: "现在把第一个 Calculator Block 的输出连接到第二个 Calculator Block 的输入。将第一块的输出引脚拖到第二块的输入引脚（A）。",
    attachTo: {
      element:
        '[data-testid^="rf__node-"]:first-child [data-id$="-result-source"]',
      on: "bottom",
    },

    buttons: [
      {
        text: "上一步",
        action: tour.back,
      },
    ],
    beforeShowPromise: () => {
      return waitForElement(
        '[data-testid^="rf__node-"]:first-child [data-id$="-result-source"]',
      );
    },
    when: {
      show: () => {
        fitViewToScreen();
        resetConnectionState(); // Reset state when revisiting this step
        tour.modal.show();
        const outputPin = document.querySelector(
          '[data-testid^="rf__node-"]:first-child [data-id$="-result-source"]',
        );
        if (outputPin) {
          outputPin.addEventListener("mousedown", handleMouseDown);
        }
      },
      hide: () => {
        const outputPin = document.querySelector(
          '[data-testid^="rf__node-"]:first-child [data-id$="-result-source"]',
        );
        if (outputPin) {
          outputPin.removeEventListener("mousedown", handleMouseDown);
        }
      },
    },
  });

  tour.addStep({
    id: "connect-blocks-input",
    title: "连接模块：输入",
    text: "现在将输出连接到第二个模块的输入引脚（A）。",
    attachTo: {
      element: '[data-testid^="rf__node-"]:nth-child(2) [data-id$="-a-target"]',
      on: "top",
    },
    buttons: [],
    beforeShowPromise: () => {
      return waitForElement(
        '[data-testid^="rf__node-"]:nth-child(2) [data-id$="-a-target"]',
      ).then(() => {
        detectConnection();
      });
    },
    when: {
      show: () => {
        tour.modal.show();
        document.addEventListener("mouseup", handleMouseUp, true);
      },
      hide: () => {
        tour.modal.hide();
        document.removeEventListener("mouseup", handleMouseUp, true);
      },
    },
  });

  tour.addStep({
    id: "press-run-again",
    title: "再次运行",
    text: "现在再次点击“运行”按钮，执行包含新 Calculator Block 的流程！",
    attachTo: {
      element: '[data-testid="primary-action-run-agent"]',
      on: "top",
    },
    advanceOn: {
      selector: '[data-testid="primary-action-run-agent"]',
      event: "click",
    },
    buttons: [],
    beforeShowPromise: () =>
      waitForElement('[data-testid="primary-action-run-agent"]'),
    when: {
      hide: () => {
        setTimeout(() => {
          fitViewToScreen();
        }, 500);
      },
    },
  });

  tour.addStep({
    id: "congratulations",
    title: "恭喜！",
    text: "你已成功创建第一个流程。请在模块中查看输出！",
    beforeShowPromise: () => waitForElement('[data-id="latest-output"]'),
    when: {
      show: () => tour.modal.hide(),
    },
    buttons: [
      {
        text: "完成",
        action: tour.complete,
      },
    ],
  });

  // Unpin blocks and save menu when the tour is completed or canceled
  tour.on("complete", () => {
    setPinBlocksPopover(false);
    setPinSavePopover(false);
    storage.set(Key.SHEPHERD_TOUR, "completed"); // Optionally mark the tutorial as completed
  });

  for (const step of tour.steps) {
    step.on("show", () => {
      "use client";
      console.debug("sendTutorialStep");

      analytics.sendGAEvent("event", "tutorial_step_shown", { value: step.id });
    });
  }

  tour.on("cancel", () => {
    setPinBlocksPopover(false);
    setPinSavePopover(false);
    storage.set(Key.SHEPHERD_TOUR, "canceled"); // Optionally mark the tutorial as canceled
  });

  tour.start();
};
