import test from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { TEST_CREDENTIALS } from "./credentials";
import { getSelectors } from "./utils/selectors";
import {
  hasUrl,
  isDisabled,
  isEnabled,
  isHidden,
  isVisible,
} from "./utils/assertion";

test("user can publish an agent through the complete flow", async ({
  page,
}) => {
  const { getId, getText, getButton } = getSelectors(page);

  const loginPage = new LoginPage(page);
  await page.goto("/login");
  await loginPage.login(TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
  await hasUrl(page, "/marketplace");

  await page.goto("/marketplace");
  await getButton("成为创作者").click();

  const publishAgentModal = getId("publish-agent-modal");
  await isVisible(publishAgentModal, 10000);

  await isVisible(
    publishAgentModal.getByText(
      "选择你要发布的项目",
    ),
  );

  const agentToSelect = publishAgentModal.getByTestId("agent-card").first();
  await agentToSelect.click();

  const nextButton = publishAgentModal.getByRole("button", {
    name: "下一步",
    exact: true,
  });

  await isEnabled(nextButton);
  await nextButton.click();

  // 2. Adding details of agent
  await isVisible(getText("填写一些关于智能体的信息"));

  const agentName = "Test Agent Name";

  const agentTitle = publishAgentModal.getByLabel("标题");
  await agentTitle.fill(agentName);

  const agentSubheader = publishAgentModal.getByLabel("副标题");
  await agentSubheader.fill("Test Agent Subheader");

  const agentSlug = publishAgentModal.getByLabel("Slug（链接标识）");
  await agentSlug.fill("test-agent-slug");

  const youtubeInput = publishAgentModal.getByLabel("YouTube 视频链接");
  await youtubeInput.fill("https://www.youtube.com/watch?v=test");

  const categorySelect = publishAgentModal.locator(
    'select[aria-hidden="true"]',
  );
  await categorySelect.selectOption({ value: "other" });

  const descriptionInput = publishAgentModal.getByLabel("描述");
  await descriptionInput.fill(
    "This is a test agent description for the automated test.",
  );

  await isEnabled(publishAgentModal.getByRole("button", { name: "提交审核" }));
});

test("should display appropriate content in agent creation modal when user is logged out", async ({
  page,
}) => {
  const { getText, getButton } = getSelectors(page);

  await page.goto("/marketplace");
  await getButton("成为创作者").click();

  await isVisible(
    getText(
      "登录或创建账号，即可将你的智能体发布到智能体市场，并加入创作者社区",
    ),
  );
});

test("should validate all form fields in publish agent form", async ({
  page,
}) => {
  const { getId, getText, getButton } = getSelectors(page);

  const loginPage = new LoginPage(page);
  await page.goto("/login");
  await loginPage.login(TEST_CREDENTIALS.email, TEST_CREDENTIALS.password);
  await hasUrl(page, "/marketplace");

  await page.goto("/marketplace");
  await getButton("成为创作者").click();

  const publishAgentModal = getId("publish-agent-modal");
  await isVisible(publishAgentModal, 10000);

  const agentToSelect = publishAgentModal.getByTestId("agent-card").first();
  await agentToSelect.click();

  const nextButton = publishAgentModal.getByRole("button", {
    name: "下一步",
    exact: true,
  });
  await nextButton.click();

  await isVisible(getText("填写一些关于智能体的信息"));

  // Get form elements
  const agentTitle = publishAgentModal.getByLabel("标题");
  const agentSubheader = publishAgentModal.getByLabel("副标题");
  const agentSlug = publishAgentModal.getByLabel("Slug（链接标识）");
  const youtubeInput = publishAgentModal.getByLabel("YouTube 视频链接");
  const categorySelect = publishAgentModal.locator(
    'select[aria-hidden="true"]',
  );
  const descriptionInput = publishAgentModal.getByLabel("描述");
  const submitButton = publishAgentModal.getByRole("button", {
    name: "提交审核",
  });

  async function clearForm() {
    await agentTitle.clear();
    await agentSubheader.clear();
    await agentSlug.clear();
    await youtubeInput.clear();
    await descriptionInput.clear();
  }

  // 1. Test required field validations
  await clearForm();
  await submitButton.click();

  await isVisible(publishAgentModal.getByText("请输入标题"));
  await isVisible(publishAgentModal.getByText("请输入副标题"));
  await isVisible(publishAgentModal.getByText("请输入 Slug"));
  await isVisible(publishAgentModal.getByText("请选择分类"));
  await isVisible(publishAgentModal.getByText("请输入描述"));

  // 2. Test field length limits
  await clearForm();

  // Test title length limit (100 characters)
  const longTitle = "a".repeat(101);
  await agentTitle.fill(longTitle);
  await agentTitle.blur();
  await isVisible(
    publishAgentModal.getByText("标题需少于 100 个字符"),
  );

  // Test subheader length limit (200 characters)
  const longSubheader = "b".repeat(201);
  await agentSubheader.fill(longSubheader);
  await agentSubheader.blur();
  await isVisible(
    publishAgentModal.getByText("副标题需少于 200 个字符"),
  );

  // Test slug length limit (50 characters)
  const longSlug = "c".repeat(51);
  await agentSlug.fill(longSlug);
  await agentSlug.blur();
  await isVisible(
    publishAgentModal.getByText("Slug 需少于 50 个字符"),
  );

  // Test description length limit (1000 characters)
  const longDescription = "d".repeat(1001);
  await descriptionInput.fill(longDescription);
  await descriptionInput.blur();
  await isVisible(
    publishAgentModal.getByText(
      "描述需少于 1000 个字符",
    ),
  );

  // Test invalid characters in slug
  await agentSlug.fill("Invalid Slug With Spaces");
  await agentSlug.blur();
  await isVisible(
    publishAgentModal.getByText(
      "Slug 只能包含小写字母、数字和连字符（-）",
    ),
  );

  await agentSlug.clear();
  await agentSlug.fill("InvalidSlugWithCapitals");
  await agentSlug.blur();
  await isVisible(
    publishAgentModal.getByText(
      "Slug 只能包含小写字母、数字和连字符（-）",
    ),
  );

  await agentSlug.clear();
  await agentSlug.fill("invalid-slug-with-@#$");
  await agentSlug.blur();
  await isVisible(
    publishAgentModal.getByText(
      "Slug 只能包含小写字母、数字和连字符（-）",
    ),
  );

  // Test valid slug format should not show error
  await agentSlug.clear();
  await agentSlug.fill("valid-slug-123");
  await agentSlug.blur();
  await page.waitForTimeout(500);

  await isHidden(
    publishAgentModal.getByText(
      "Slug 只能包含小写字母、数字和连字符（-）",
    ),
  );

  // Test invalid YouTube URL
  await youtubeInput.fill("https://www.google.com/invalid-url");
  await youtubeInput.blur();
  await isVisible(
    publishAgentModal.getByText("请输入有效的 YouTube 链接"),
  );

  await youtubeInput.clear();
  await youtubeInput.fill("not-a-url-at-all");
  await youtubeInput.blur();
  await isVisible(
    publishAgentModal.getByText("请输入有效的 YouTube 链接"),
  );

  // Test valid YouTube URLs should not show error
  await youtubeInput.clear();
  await youtubeInput.fill("https://www.youtube.com/watch?v=test");
  await youtubeInput.blur();
  await page.waitForTimeout(500);

  await isHidden(
    publishAgentModal.getByText("请输入有效的 YouTube 链接"),
  );

  await youtubeInput.clear();
  await youtubeInput.fill("https://youtu.be/test123");
  await youtubeInput.blur();
  await page.waitForTimeout(500);

  await isHidden(
    publishAgentModal.getByText("请输入有效的 YouTube 链接"),
  );

  // 5. Test submit button enabled/disabled state
  await clearForm();

  // Submit button should be disabled when form is empty
  await page.waitForTimeout(1000);
  await isDisabled(submitButton);

  // Fill all required fields with valid data
  await agentTitle.fill("Valid Title");
  await agentSubheader.fill("Valid Subheader");
  await agentSlug.fill("valid-slug");
  await categorySelect.selectOption({ value: "other" });
  await descriptionInput.fill("Valid description text");

  // Submit button should now be enabled
  await isEnabled(submitButton);
});
