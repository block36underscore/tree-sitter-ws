"var" @keyword
(identifier) @variable.parameter
(function_definition(identifier) @function)
(function_call(identifier) @function)
(number) @number
(string) @string
(primitive_type) @type.builtin
(comment) @comment
(using) @module

((identifier) @constant
 (#match? @constant "^[A-Z][A-Z\\d_]+$'"))
