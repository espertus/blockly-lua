/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Lua for unit test blocks.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

Blockly.Lua['unittest_main'] = function(block) {
  // Container for unit tests.
  var resultsVar = Blockly.Lua.variableDB_.getName('unittestResults',
      Blockly.Variables.NAME_TYPE);
  var functionName = Blockly.Lua.provideFunction_(
      'unittest_report',
      ['function ' + Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_ + '()',
       '  -- Create test report.',
       '  report = {}',
       '  summary = {}',
       '  fails = 0',
       '  for _, v in pairs(' + resultsVar + ') do',
       '    if v["success"] then',
       '      table.insert(summary, ".")',
       '    else',
       '      table.insert(summary, "F")',
       '      fails = fails + 1',
       '      table.insert(report, "FAIL: " .. v["title"])',
       '      table.insert(report, v["log"])',
       '    end',
       '  end',
       '  table.insert(report, 1, table.concat(summary, ""))',
       '  table.insert(report, "")',
       '  table.insert(report, "Number of tests run: " .. #' + resultsVar + ')',
       '  table.insert(report, "")',
       '  if fails > 0 then',
       '    table.insert(report, "FAILED (failures=" .. fails .. ")")',
       '  else',
       '    table.insert(report, "OK")',
       '  end',
       '  return table.concat(report, "\\n")',
       'end']);
  // Setup global to hold test results.
  var code = resultsVar + ' = {}\n';
  // Run tests (unindented).
  code += Blockly.Lua.statementToCode(block, 'DO')
      .replace(/^  /, '').replace(/\n  /g, '\n');
  var reportVar = Blockly.Lua.variableDB_.getDistinctName(
      'report', Blockly.Variables.NAME_TYPE);
  code += reportVar + ' = ' + functionName + '()\n';
  // Destroy results.
  code += resultsVar + ' = nil\n';
  // Print the report.
  code += 'print(' + reportVar + ')\n';
  return code;
};



Blockly.Lua.unittest_main.defineAssert_ = function(block) {
  var resultsVar = Blockly.Lua.variableDB_.getName('unittestResults',
      Blockly.Variables.NAME_TYPE);
  var functionName = Blockly.Lua.provideFunction_(
      'assertEquals',
      ['function ' + Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_ +
          '(actual, expected, message)',
       '  -- Asserts that a value equals another value.',
       '  assert(' + resultsVar + ' ~= nil, ' +
           '"Orphaned assert equals: " ..  message)',
       '  if type(actual) == "table" and type(expected) == "table" then',
       // This comparison is not sufficiently strict for the general case,
       // where list entries contain commas, but our unit tests will not be
       // written by adversaries.
       '    expected = "{" .. table.concat(expected, ", ") .. "}"',
       '    actual = "{" .. table.concat(actual, ", ") .. "}"',
       '  end',
       '  if actual == expected then',
       '    table.insert(' + resultsVar +
           ', {success=true, log="OK", title=message})',
       '  else',
       '    table.insert(' + resultsVar + ', {success=false, ' +
           'log=string.format("Expected: %s\\nActual: %s"' +
               ', expected, actual), title=message})',
       '  end',
       'end']);
  return functionName;
};

Blockly.Lua['unittest_assertequals'] = function(block) {
  // Asserts that a value equals another value.
  var message = Blockly.Lua.quote_(block.getTitleValue('MESSAGE'));
  var actual = Blockly.Lua.valueToCode(block, 'ACTUAL',
      Blockly.Lua.ORDER_NONE) || 'nil';
  var expected = Blockly.Lua.valueToCode(block, 'EXPECTED',
      Blockly.Lua.ORDER_NONE) || 'nil';
  return Blockly.Lua.unittest_main.defineAssert_() +
      '(' + actual + ', ' + expected + ', ' + message + ')\n';
};

Blockly.Lua['unittest_assertvalue'] = function(block) {
  // Asserts that a value is true, false, or null.
  var message = Blockly.Lua.quote_(block.getTitleValue('MESSAGE'));
  var actual = Blockly.Lua.valueToCode(block, 'ACTUAL',
      Blockly.Lua.ORDER_NONE) || 'nil';
  var expected = block.getTitleValue('EXPECTED');
  if (expected == 'TRUE') {
    expected = 'true';
  } else if (expected == 'FALSE') {
    expected = 'false';
  } else if (expected == 'NULL') {
    expected = 'nil';
  }
  return Blockly.Lua.unittest_main.defineAssert_() +
      '(' + actual + ', ' + expected + ', ' + message + ')\n';
};

Blockly.Lua['unittest_fail'] = function(block) {
  // Always assert an error.
  var resultsVar = Blockly.Lua.variableDB_.getName('unittestResults',
      Blockly.Variables.NAME_TYPE);
  var message = Blockly.Lua.quote_(block.getTitleValue('MESSAGE'));
  if (!Blockly.Lua.unittest_fail.assert) {
    var functionName = Blockly.Lua.provideFunction_(
        'fail',
        ['function ' + Blockly.Lua.FUNCTION_NAME_PLACEHOLDER_ + '(message)',
         '  -- Always assert an error.',
         '  assert(resultsVar ~= nil, "Orphaned assert equals: " .. message)',
         '  table.insert(' + resultsVar +
             ', {success=false, log="Fail.", title=message})',
         'end']);
    Blockly.Lua.unittest_fail.assert = functionName;
  }
  return Blockly.Lua.unittest_fail.assert + '(' + message + ')\n';
};
