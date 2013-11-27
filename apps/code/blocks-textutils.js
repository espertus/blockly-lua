/**
 * Blockly Lua: ComputerCraft Textutils API
 *
 * Copyright 2013 Google Inc.
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
 * @fileoverview Blocks for ComputerCraft Textutils API
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

Blockly.ComputerCraft.TEXTUTILS_BLOCK_COLOUR_ = 190;

Blockly.ComputerCraft.TEXTUTILS_FUNCS_ = [
  {funcName: 'slowWrite',
   text: 'write string %1 to screen at rate %2',
   args: [['TEXT', 'String'], ['RATE', 'Number']],
   tooltip:
   'Write the given string to the screen (terminal or monitor)\n'+
   'at the current cursor position character-by-character.\n' +
   'The higher the rate, the faster the string is output.\n' +
   'A value of 1 outputs one character per second.' +
   'Unlike with the "write line" block, no newline is printed at the end.\n'
  },
  {funcName: 'slowPrint',
   text: 'write line %1 to screen at rate %2',
   args: [['TEXT', 'String'], ['RATE', 'Number']],
   tooltip:
   'Write the given string to the screen (terminal or monitor)\n'+
   'at the current cursor position character-by-character.\n' +
   'The higher the rate, the faster the string is output.\n' +
   'A value of 1 outputs one character per second.' +
   'Unlike with the "write string" block, a newline is printed at the end.\n'
  },
  {funcName: 'pagedPrint',
   text: 'write string %1 paginated',
   args: [['TEXT', 'String']],
   tooltip:
   'Print the string to the screen (terminal or monitor),\n' +
   'waiting for confirmation before scrolling down.'},
  {funcName: 'serialize',
   text: 'convert table %1 to string',
   args: [['TABLE', 'Table']],
   output: 'String',
   tooltip:
   'Serialize the table into a string for\n' +
   'display, storage, or transmission.\n' +
   'The table can be recovered with the\n' +
   '"convert string to table" block.'
  },
  {funcName: 'unserialize',
   text: 'covert string %1 to table',
   args: [['TEXT', 'String']],
   output: 'Table',
   tooltip:
   'Unserialize a string representation of a table\n' +
   'created with the "convert table to string" block.'
  },
  {funcName: 'urlEncode',
   text: 'encode %1 for URL',
   args: [['TEXT', 'String']],
   tooltip:
   'Encode a string for transmission within a URL.\n' +
   'Spaces are replaced with "+s".  Unsafe characters,\n' +
   'such as quotation marks, are replaced by their ASCII\n' +
   'values and preceded with a percent sign (%).'
  }
];

for (var i = 0; i < Blockly.ComputerCraft.TEXTUTILS_FUNCS_.length; i++) {
  Blockly.ComputerCraft.buildValueBlock(
    'textutils',
    Blockly.ComputerCraft.TEXTUTILS_BLOCK_COLOUR_,
    Blockly.ComputerCraft.TEXTUTILS_FUNCS_[i]);
}

Blockly.ComputerCraft.buildBlockWithDependentInput(
  'textutils',
  Blockly.ComputerCraft.TEXTUTILS_BLOCK_COLOUR_,
  {funcName: 'formatTime',
   text: 'format %1 %2',
   args: [['CHOICE',
           [['current time', 'current'],
            ['time...', 'time']]],
          ['TIME', 'Time']],
   ddName: 'CHOICE',
   ddValue: 'time',
   depName: 'TIME',
   depType: 'Time',
   tooltip: 'Format the current or given time as a printable string.'});
