/**
 * Blockly Lua: ComputerCraft Bit API
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
 * @fileoverview Blocks for ComputerCraft Bit API
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.require('ComputerCraft.ValueBlock');

Blockly.ComputerCraft.BIT_BLOCK_COLOUR_ = 290;

Blockly.ComputerCraft.BIT_FUNCS_ = [
  {blockName: 'shift',
   text: 'shift %1 %2 %3 bits',
   args: [['N', 'Number'],
          ['OPTION', new Blockly.FieldDropdown(
            [['left', 'blshift'],
             ['right arithmetically', 'brshift'],
             ['right logically', 'blogic_rshift']])],
           ['BITS', 'Number']],
   output: 'Number',
   ddFuncName: 'OPTION',
   tooltip:
   'Shift the number by the specified number of bits.\n' +
   'This inputs are treated as 32-bit unsigned integers.\n' +
   'An error is raises if either input is greater than 2^32 - 1.',
   helpUrlType: Blockly.ComputerCraft.HelpUrlType.PREFIX_DD
  },
  {blockName: 'bitwise',
   text: '%1 %2 %3',
   args: [['X', 'Number'],
          ['FUNCTION', new Blockly.FieldDropdown(
            [['XOR', 'bxor'],
             ['OR', 'bor'],
             ['AND', 'band']])],
           ['Y', 'Number']],
   output: 'Number',
   ddFuncName: 'FUNCTION',
   tooltip: function(block) {
     var HELP = {'bxor': {name: 'exclusive OR', description: 'exactly one'},
                 'bor': {name: 'inclusive OR', description: 'at least one'},
                 'band': {name: 'AND', description: 'both'}};
     var help = HELP[block.getTitleValue('FUNCTION')];
     return 'Compute the bitwise ' + help.name.toUpperCase()
        + ' of the two numeric inputs.\n' +
        'For each of the 32 bit positions, the value is 1 if and only if\n' +
        help.description.toUpperCase()
        + ' of the corresponding bits in the inputs are 1.';
   }
  },
  {funcName: 'bnot',
   text: 'bitwise not %1',
   args: [['X', 'Number']],
   output: 'Number',
   tooltip:
   'Compute the bitwise inverse of a number, taken in\n' +
   'the domain and range of 32-bit unsigned integers.'}
];

Blockly.ComputerCraft.BIT_FUNCS_.forEach(function(info) {
  Blockly.ComputerCraft.buildValueBlock(
    'bit', Blockly.ComputerCraft.BIT_BLOCK_COLOUR_, info)});
