using System;
using System.Linq;
using System.Text;
using System.Threading;

namespace BoiledEggs
{
    static class Program
    {
        private const string EggMaker = "EggMaker: ";
        private const string Player = "You: ";
        private static readonly StringBuilder builder = new StringBuilder();
        private static ConsoleKeyInfo lastPressedKey;
        private static byte lastPlayerInput;
        private static byte optionDisplayCount = 1;
        private static string lastMessageToPrint;
        private static readonly AutoResetEvent autoEvent = new AutoResetEvent(false);
        private static int timerCursorLeft;
        private static int timerCursorTop;

        private static void Print(this string recipient, params string[] messages)
        {
            lastMessageToPrint = messages.Last();
            foreach (string message in messages)
            {
                Console.WriteLine($"{recipient}{message}");
                if (lastMessageToPrint != message)
                {
                    Console.ReadKey(true);
                }
            }
        }

        private static void PrintSystemMessage(ConsoleColor msgColor, string message)
        {
            Console.ForegroundColor = msgColor;
            Console.WriteLine(Environment.NewLine + CentralizeString(message));
            Console.ForegroundColor = ConsoleColor.Gray;
        }

        private static void PrintOptions(params string[] options)
        {
            optionDisplayCount = 1;
            builder.Clear();
            builder.Append(Environment.NewLine);
            foreach (string option in options)
            {
                builder.Append($"{optionDisplayCount++}) {option}   ");
            }

            Console.WriteLine(builder.ToString());
        }

        private static string CentralizeString(string text)
        {
            return String.Format("{0," + ((Console.WindowWidth / 2) + (text.Length / 2)) + "}", text);
        }

        private static byte GetPlayerInput(byte numberOfOptions)
        {
            do
            {
                lastPressedKey = Console.ReadKey(true);

                // Not using expression switch here, because we'll overflow the heap with recursive calls... (thread deepening or whatever it was called)
                switch ((byte)lastPressedKey.KeyChar)
                {
                    case 49 when numberOfOptions > 0:
                        return 1;
                    case 50 when numberOfOptions > 1:
                        return 2;
                    case 51 when numberOfOptions > 2:
                        return 3;
                    case 52 when numberOfOptions > 3:
                        return 4;
                }
            } while (true);
        }

        private static void BoilEggs()
        {
            int state = 60;
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write(CentralizeString($"{EggMaker[0..^2]} is cooking your eggs. Time left until food is ready: "));
            timerCursorLeft = Console.CursorLeft;
            timerCursorTop = Console.CursorTop;
            Console.CursorVisible = false;
            Timer threadTimer = new Timer(callback =>
            {
                if (state == 0)
                {
                    Console.WriteLine("0 ");
                    autoEvent.Set();
                    return;
                }
                if (state <= 10)
                {
                    Console.Write($"{state--} ");
                }
                else
                {
                    Console.Write(state--);
                }

                Console.CursorLeft = timerCursorLeft;
                Console.CursorTop = timerCursorTop;
            }, state, 0, 1000);
            autoEvent.WaitOne();
            threadTimer.Dispose(autoEvent);
            Console.ForegroundColor = ConsoleColor.Gray;
            Console.WriteLine();
            Console.CursorVisible = true;
        }

        static void Main(string[] args)
        {
            Console.WriteLine("Click a key to progress through the conversation.");
            Console.ReadKey(true);
            Console.Write("Before we begin, name me something you'd call someone: ");
            string something = Console.ReadLine();
            Console.WriteLine("Sentence registered. Enjoy the show!");
            Console.ReadKey(true);
            Console.Clear();

            Player.Print($"Make me 10 eggs, {something}!");
            EggMaker.Print("Sorry, but 10 eggs are too much for me to make. How about I make you 3 eggs?",
                "I also think that eating 10 eggs in a single day is quite unhealthful...",
                "I heard that some granny on Easter holiday decided to eat 20 eggs.",
                "I think she died, or something very bad happened to her.",
                "Well? What would you have me do?");
            PrintOptions("Fine, make me 3 eggs.", $"F you! I want 10 eggs!{Environment.NewLine}");
            lastPlayerInput = GetPlayerInput(2);
            switch (lastPlayerInput)
            {
                case 1:
                    Player.Print("Fine, make me 3 eggs.");
                    EggMaker.Print("Okay then!", $"Hold on tight, I'll start making them right now!{Environment.NewLine}");
                    break;
                case 2:
                    Player.Print("F you! I want 10 eggs!");
                    EggMaker.Print("Well F you too! Go find a butler to do your chores, not me.");
                    PrintSystemMessage(ConsoleColor.Red, "You have died from starvation.");
                    Console.ReadKey(true);
                    return;
            }
            BoilEggs();
            EggMaker.Print("And... done! Here, grab yourself a bite!");
            PrintOptions("Indulge in your hunger.", $"You took too long to make the eggs, I'm not hungry anymore!{Environment.NewLine}");
            lastPlayerInput = GetPlayerInput(2);
            switch (lastPlayerInput)
            {
                case 1:
                    Player.Print("Mmm... delicious!", "Thank you so much!");
                    EggMaker.Print("You're welcome. Come back again later!");
                    Console.ReadKey(true);
                    return;
                case 2:
                    Player.Print("You took too long to make the eggs, I'm not hungry anymore!");
                    EggMaker.Print("Heh, sorry buddy, but I'm actually hungry myself, soo...",
                        "Don't mind if I eat them! *Nom* *nom* *nom*...",
                        "*Nom* *nom* *nom* *nom* *nom*...",
                        "*NOM* NOM* *NOM* *NOM*");
                    int cursorLeft = Console.CursorLeft;
                    int cursorTop = Console.CursorTop;
                    Console.CursorTop = cursorTop + 3;
                    PrintSystemMessage(ConsoleColor.Red, "You feel a slight headache...");
                    Console.CursorTop = cursorTop;
                    Console.CursorLeft = cursorLeft;
                    EggMaker.Print("*NOM* *NOOOM* *NOM* *NOM* *NOOM* *NOM* *NOM* *NOM*",
                        "Aah, that was delicious. Thank you for the spice!");
                    Console.CursorTop = cursorTop + 4;
                    PrintSystemMessage(ConsoleColor.Red, "You died... you feel as if you'd rather not know the details.");
                    Console.ReadKey(true);
                    return;
            }
        }
    }
}
