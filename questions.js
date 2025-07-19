const FAILS_WITH_SYNTAX_ERROR = "fails with SyntaxError";
const FAILS_WITH_VALUE_ERROR = "fails with ValueError";

// Quiz questions array - easily editable
const QUESTIONS = [
    {
        code: `print(f"Hello World!")`,
        question: "What will be printed?",
        answers: [
            "Hello World!",
            "Hello World!",
            "Hello World!",
            "Hello World!",
        ],
        correct: -1,
        explanation: "Correct! f-strings are working exactly as you would expect."
    },
    {
        code: `print(f"...")`,
        question: "Let's continue with this idea. What will be printed?",
        answers: [
            "Hello World!",
            "...",
            "Ellipsis",
            FAILS_WITH_SYNTAX_ERROR,
        ],
        correct: 1,
        explanation: "No funny business here, just a literal string with three dots."
    },
    {
        code: `print(f"{...}")`,
        question: "Let's do some interpolation. What will this print?",
        answers: [
            FAILS_WITH_SYNTAX_ERROR,
            "...",
            "Ellipsis",
            "prints nothing",
        ],
        correct: 2,
        explanation: "And the answer is: 'Ellipsis'. The three dots are a special object in Python that stringifies as Ellipsis. But that's hardly a feature of f-strings."
    },
    {
        code: `print(f"{...=}")`,
        question: "This on the other hand, what does this result in?",
        answers: [
            FAILS_WITH_SYNTAX_ERROR,
            "...",
            "Ellipsis",
            "...=Ellipsis",
        ],
        correct: 3,
        explanation: "This is the first special feature of f-strings: adding a trailing equals sign lets you print out the expression and what it evaluates to."
    },
    {
        code: `print(f"{... = }")`,
        question: "Does whitespace matter? What will this print?",
        answers: [
            FAILS_WITH_SYNTAX_ERROR,
            "...=Ellipsis",
            "... =Ellipsis",
            "... = Ellipsis",
        ],
        correct: 3,
        explanation: "Interestingly the whitespace is preserved in the output exactly as it was written. It would even preserve newlines and tabs!"
    },
    {
        code: `print(f"{[1,2,3]}")`,
        question: "What would happen with lists here after printing?",
        answers: [
            "[1, 2, 3]",
            "[1,2,3]",
            "{[1,2,3]}",
            "{[1, 2, 3]}"
        ],
        correct: 0,
        explanation: "Whitespace is only preserved for the expression, not for the repr of the output. Since lists stringify with whitespace, it looks a bit different."
    },
    {
        code: `print(f"{{1,2,3}}")`,
        question: "What about sets then? What would we see?",
        answers: [
            "{1, 2, 3}",
            "{1,2,3}",
            "{{1,2,3}}",
            "{{1, 2, 3}}"
        ],
        correct: 1,
        explanation: "Well isn't that surprising? That's because here we did not actually use a set, instead '{{' and '}}' escape the curly brace."
    },
    {
        code: `print(f"{1,2,3}")`,
        question: "Well is this a set then? What does it print?",
        answers: [
            "{1, 2, 3}",
            "{1,2,3}",
            "(1, 2, 3)",
            FAILS_WITH_SYNTAX_ERROR,
        ],
        correct: 2,
        explanation: "Because the grammar allows an expression here, an implicit tuple expression is assumed and we actually printed the debug repr of a tuple of three items instead."
    },
    {
        code: `print(f"{ {1,2,3} }")`,
        question: "Can we get a set for once? What about this?",
        answers: [
            "{1, 2, 3}",
            "{1,2,3}",
            "(1, 2, 3)",
            FAILS_WITH_SYNTAX_ERROR,
        ],
        correct: 0,
        explanation: "Effective use of whitespace ensures that we can actually use a set literal for once <3"
    },
    {
        code: `print(f"{255:x}")`,
        question: "Let's try some format modifiers. What will this print?",
        answers: [
            "255",
            FAILS_WITH_VALUE_ERROR,
            "ff",
            "ÿ"
        ],
        correct: 2,
        explanation: "The x modifier formats the number as hexadecimal. Note that it does not use the 0x prefix."
    },
    {
        code: `print(f"{255:c}")`,
        question: "Let's look at another one.",
        answers: [
            "255",
            FAILS_WITH_VALUE_ERROR,
            "ff",
            "ÿ"
        ],
        correct: 3,
        explanation: "This one converts it into a unicode character which happens to be the character 'ÿ'."
    },
    {
        code: `print(f"{255:#x}")`,
        question: "Hint: there is the concept of alternative formats. What will this print?",
        answers: [
            "ff",
            "FF",
            "0xff",
            "0xFF"
        ],
        correct: 2,
        explanation: "For integers it will just add the leading 0x to the hexadecimal representation. Similar things are also possible for other formats like octal or binary."
    },
    {
        code: `print(f"{255#x}")`,
        question: "What about this? Looks similar, doesn't it?",
        answers: [
            "ff",
            "0xff",
            FAILS_WITH_SYNTAX_ERROR,
            FAILS_WITH_VALUE_ERROR,
        ],
        correct: 2,
        explanation: "This is in fact a syntax error because the '#' is the beginning of a comment and so 'x}' are part of the comment and our string was never closed!",
    },
    {
        code: `print(f"{42:<8}!")`,
        question: "Let's have a look at alignment. What will this print?",
        answers: [
            "42      !",
            "      42!",
            "42!",
            FAILS_WITH_VALUE_ERROR,
        ],
        correct: 0,
        explanation: "The '<' modifier left-aligns the number in a field of 8 characters, so it will print '42' followed by 6 spaces and then '!'.",
    },
    {
        code: `print(f"{42:>8}!")`,
        question: "Can we flip it around? What will this print?",
        answers: [
            "42      !",
            "      42!",
            "42!",
            FAILS_WITH_VALUE_ERROR,
        ],
        correct: 1,
        explanation: "Well that shouldn't be a surprise, we align the other way round.",
    },
    {
        code: `print(f"{1<10}!")`,
        question: "What about this? What might this print?",
        answers: [
            "1         !",
            "True!",
            FAILS_WITH_VALUE_ERROR,
            FAILS_WITH_SYNTAX_ERROR,
        ],
        correct: 1,
        explanation: "No colon means we're just rendering an expression and because 1 is smaller than 10, it evaluates to True. The f-string does not interpret the '<' as a format specifier.",
    },
    {
        code: `print(f"{1:0>10}")`,
        question: "There is so much more power in these. What will this print?",
        answers: [
            "0000000001",
            "0000000000",
            "         1",
            "         0",
        ],
        correct: 0,
        explanation: "Whatever is on the left of the alignment operator is the fill character. We just fill it with zeros here.",
    },
    {
        code: `print(f"{1<5:1<5}")`,
        question: "Putting it all together, what will this print?",
        answers: [
            "True1",
            "1True",
            FAILS_WITH_VALUE_ERROR,
            "11111",
        ],
        correct: 3,
        explanation: "Well that's unexpected. The first 1 < 5 evaluates to True, but for some reason booleans render like integers when padded since they are a subclass of int.  So we're padding out to 5 characters, all of which are prefixed by 1.",
    },
    {
        code: `a = 42
print(f"{a:=10}")`,
        question: "Let's introduce some variables. What will this print?",
        answers: [
            "        42",
            "a=42      ",
            FAILS_WITH_VALUE_ERROR,
            "10",
        ],
        correct: 0,
        explanation: "This is a form of padding. = forces the padding to be placed after the sign (if any) but before the digits.",
    },
    {
        code: `a = 42
print(f"{(a:=10)}")`,
        question: "Does this change anything? What will this print?",
        answers: [
            "        42",
            "a=42      ",
            FAILS_WITH_VALUE_ERROR,
            "10",
        ],
        correct: 3,
        explanation: "This is a bit of a trick question. The walrus operator here assigns 10 to a and the f-string then prints that result.",
    },
    {
        code: `a = b = 1
print(f"{(a, b := [1, 1])}")`,
        question: "Let's try with more than one target here. What will this print?",
        answers: [
            FAILS_WITH_VALUE_ERROR,
            "(1, 1)",
            "[1, 1]",
            "(1, [1, 1])",
        ],
        correct: 3,
        explanation: "This doesn't really have anything to do with f-strings, but the walrus operator binds quite narrow so we build a tuple of a as it was assigned, and we override b with the list to the right. As a byproduct b was also rebound to [1, 1].",
    },
    {
        code: `print(f"{f"{{}}"}")`,
        question: "Can they be nested? What will it print?",
        answers: [
            FAILS_WITH_SYNTAX_ERROR,
            "{}",
            "f{}",
            "f\"{}\"",
        ],
        correct: 1,
        explanation: "Yes! They can be nested.  The {{ and }} just escapes it like before.",
    },
];