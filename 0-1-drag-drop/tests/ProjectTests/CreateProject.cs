using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using ProjectTests.Util;
using System.Text;

namespace ProjectTests
{
    [TestClass]
    public class CreateProject
    {
        private static IWebDriver driver;
        private StringBuilder verificationErrors;
        private static string baseUrl;
        private bool acceptNextAlert = true;

        [ClassInitialize]
        public static void InitializeClass(TestContext testContext)
        {
            driver = new ChromeDriver();
            baseUrl = WebDriverUtils.baseUrl;
        }

        [ClassCleanup]
        public static void CleanupClass()
        {
            driver.Close();
            driver.Dispose();
        }

        [TestInitialize]
        public void InitializeTest()
        {
            verificationErrors = new StringBuilder();
        }

        [TestCleanup]
        public void CleanupTest()
        {
            Assert.AreEqual("", verificationErrors.ToString());
        }

        [TestMethod]
        public void CreateProject_CreateProjects_ShouldCreateTwoProjects()
        {
            driver.Navigate().GoToUrl(baseUrl);

            FillTextInputs();
            SubmitProject();

            FillInvalidTextInputs();
            SubmitProject();
            Assert.AreEqual("Invalid input!", CloseAlertAndGetItsText());

            FillTextInputs();
            SubmitProject();

            var projectsList = driver.FindElement(By.Id("active-projects-list"));
            var projectItems = projectsList.FindElements(By.XPath(".//li"));

            Assert.IsTrue(projectItems.Count == 2);
        }

        public static void FillTextInputs(IWebDriver? driver = null)
        {
            driver ??= CreateProject.driver;

            var randStr = WebDriverUtils.RandomString();
            var randNum = WebDriverUtils.RandomInt();

            driver.FindElement(By.Id("title")).Clear();
            driver.FindElement(By.Id("title")).SendKeys($"Title -- {randStr}");
            driver.FindElement(By.Id("description")).Clear();
            driver.FindElement(By.Id("description")).SendKeys($"Description -- {randStr}");
            driver.FindElement(By.Id("people")).Clear();
            driver.FindElement(By.Id("people")).SendKeys(randNum.ToString());
        }

        public static void FillInvalidTextInputs(IWebDriver? driver = null)
        {
            driver ??= CreateProject.driver;

            driver.FindElement(By.Id("title")).Clear();
            driver.FindElement(By.Id("title")).SendKeys("Invalid Project");
            driver.FindElement(By.Id("description")).Clear();
            driver.FindElement(By.Id("description")).SendKeys(".");
            driver.FindElement(By.Id("people")).Clear();
            driver.FindElement(By.Id("people")).SendKeys("3");
        }

        public static void SubmitProject(IWebDriver? driver = null)
        {
            driver ??= CreateProject.driver;

            driver.FindElement(By.XPath("//button[@type='submit']")).Click();
        }

        private string CloseAlertAndGetItsText()
        {
            try
            {
                IAlert alert = driver.SwitchTo().Alert();
                string alertText = alert.Text;
                if (acceptNextAlert)
                {
                    alert.Accept();
                }
                else
                {
                    alert.Dismiss();
                }
                return alertText;
            }
            finally
            {
                acceptNextAlert = true;
            }
        }
    }
}