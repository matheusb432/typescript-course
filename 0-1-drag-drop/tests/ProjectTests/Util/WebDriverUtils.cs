using System;
using System.Linq;

namespace ProjectTests.Util
{
    public static class WebDriverUtils
    {
        public const string baseUrl = "http://localhost:8081/";

        public static string RandomString(int length = 5, bool includeLetters = true, bool includeNumbers = true)
        {
            var random = new Random();

            var chars = "";

            chars += includeLetters ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "";
            chars += includeNumbers ? "0123456789" : "";

            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public static int RandomInt(int min = 1, int max = 5)
        {
            var random = new Random();

            return random.Next(min, max);
        }
    }
}