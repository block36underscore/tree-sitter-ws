module.exports = grammar({
  name: "wynnscript",
  word: ($) => $.identifier,
  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => repeat(choice($._definition, $._statement)),
    _definition: ($) =>
      choice(
        $.function_definition,
        // TODO: other kinds of definitions
      ),
    function_definition: ($) => seq($.identifier, $.parameter_list, $.block),
    parameter_list: ($) =>
      prec(
        2,
        seq(
          "(",
          repeat(seq($._type, $.identifier, ",")),
          optional(seq($._type, $.identifier)),
          ")",
        ),
      ),

    _type: ($) => prec(10, choice($.primitive_type)),

    primitive_type: ($) =>
      choice(
        /bool/i,
        /bool_list/i,
        /button/i,
        /decimal/i,
        /decimal_list/i,
        /entity_ref/i,
        /integer/i,
        /integer_list/i,
        /menu/i,
        /mob/i,
        /projectile/i,
        /string/i,
        /string_list/i,
      ),

    block: ($) => seq("{", repeat($._statement), "}"),

    _statement: ($) =>
      prec(
        2,
        choice(
          $.variable,
          $.assignment,
          $.function_call,
          $.if,
          $.else,
          $.loop,
          $.using,
          $.block,
          $.atomic,
          $._expression,
          $.comment,
          ";",
        ),
      ),

    variable: ($) => seq("var", $.assignment, optional(seq(":", $._type))),

    assignment: ($) =>
      choice(
        prec.right(
          1,
          seq(
            $.identifier,
            choice("=", "+=", "-=", "*=", "/="),
            choice($._expression, $._type),
          ),
        ),
      ),

    function_call: ($) =>
      prec(
        6,
        choice(
          seq($.identifier, $.call_param_list),
          seq($.identifier, ".", $.identifier, $.call_param_list),
        ),
      ),

    call_param_list: ($) =>
      seq("(", repeat(seq($._expression, ",")), optional($._expression), ")"),

    if: ($) => seq("if", $.condition, $.block),
    else: ($) => choice(seq("else", $.block), seq("else", $.if)),
    loop: ($) =>
      seq(choice("while", "fwhile"), "(", $._expression, ")", $.block),

    condition: ($) => seq("(", $._expression, ")"),

    using: ($) => seq("#using", $.path),

    atomic: ($) => seq("atomic", $.block),

    _expression: ($) =>
      choice(
        $.unary_expression,
        $.binary_expression,
        $.number,
        $.string,
        $.function_call,
        $.bool,
        $.identifier,
      ),

    unary_expression: ($) =>
      choice(
        prec.right(
          1,
          choice(
            seq("-", $._expression),
            seq("!", $._expression),
            seq("++", $._expression),
            seq("--", $._expression),
          ),
        ),
        prec.left(
          3,
          choice(seq($._expression, "++"), seq($._expression, "--")),
        ),
      ),

    binary_expression: ($) =>
      choice(
        prec.left(4, seq($._expression, "*", $._expression)),
        prec.left(4, seq($._expression, "+", $._expression)),
        prec.left(3, seq($._expression, "/", $._expression)),
        prec.left(3, seq($._expression, "-", $._expression)),
        prec.left(2, seq($._expression, "<", $._expression)),
        prec.left(2, seq($._expression, ">", $._expression)),
        prec.left(2, seq($._expression, "==", $._expression)),
        prec.left(2, seq($._expression, "!=", $._expression)),
        prec.left(2, seq($._expression, "<=", $._expression)),
        prec.left(2, seq($._expression, ">=", $._expression)),
      ),

    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    number: ($) => prec(10, /\d+\.?\d*/),

    bool: ($) => choice("true", "false"),

    path: ($) => prec(10, /[a-zA-Z/]+\.ws/),

    string: ($) =>
      seq('"', repeat(choice($.string_content, $.escape_sequence)), /[^\\]"/),

    escape_sequence: ($) => prec(12, '\\"'),

    string_content: ($) => prec(11, /[^"]+/),

    comment: ($) => seq("#", /[^\r\n\u2028\u2029]*/),
  },
});
