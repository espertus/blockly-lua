/**
 * Blockly Lua: ComputerCraft Vector API
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
 * @fileoverview Blocks for ComputerCraft Vector API
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

Blockly.ComputerCraft.VECTOR_BLOCK_COLOUR_ = 290;

Blockly.ComputerCraft.VECTOR_FUNCS_ = [
  {funcName: 'new',
   text: 'create vector (%1, %2, %3)',
   args: [['X', 'Number'], ['Y', 'Number'], ['Z', 'Number']],
   output: 'Vector',
   tooltip:
   'Create a vector with the given x, y, and z co-ordinates.'},
  {blockName: 'add_sub',
   text: 'vector %1 %2 vector %3',
   args: [['X', 'Vector'],
          ['OP', new Blockly.FieldDropdown(
            [['+', 'add'],
             ['-', 'sub']])],
          ['Y', 'Vector']],
   ddFuncName: 'OP',
   output: 'Vector',
   tooltip:
   'Compute the sum or difference of two vectors.\n' +
   'This does not modify either of the input vectors.'},
  {funcName: 'mul',
   text: 'vector %1 x scalar %2',
   args: [['V', 'Vector'],
          ['N', 'Number']],
   output: 'Vector',
   tooltip:
   'Create a vector that scales the input vector by the input number.\n' +
   'This does not modify the input vector.'},
  {funcName: 'dot',
   text: 'vector %1 · vector %2',
   args: [['X', 'Vector'],
          ['Y', 'Vector']],
   output: 'Vector',
   tooltip:
   'Compute the dot product of the two inputs vectors.\n' +
   'This does not modify either of the input vectors.\n'},
  {funcName: 'cross',
   text: 'vector %1 x vector %2',
   args: [['X', 'Vector'],
          ['Y', 'Vector']],
   output: 'Vector',
   tooltip:
   'Create a vector that is the cross product of the two inputs vectors.\n' +
   'This does not modify either of the input vectors.\n'},
  {funcName: 'length',
   text: 'length of vector %1',
   args: [['X', 'Vector']],
   output: 'Number',
   tooltip:
   'Calculate the length of the input vector.\n' +
   'This is defined as the distance from the origin.\n'},
  {funcName: 'normalize',
   text: 'normalize vector %1',
   args: [['X', 'Vector']],
   output: 'Number',
   tooltip:
   'Create a vector that is a normalized version of the input vector.\n' +
   'In other words, each of the values will be scaled proportionately\n' +
   'such that the length of the new vector is 1.  The input vector is unchanged.'},
  {funcName: 'tostring',
   text: 'create string for vector %1',
   args: [['X', 'Vector']],
   output: 'String',
   tooltip: 'Create a string representation of the input vector.'},
  // A custom code generator for the block is defined below.
  {blockName: 'get_coord',
   text: 'get the %1 co-ordinate of vector %2',
   args: [['COORD',
           new Blockly.FieldDropdown([['x', 'x'], ['y', 'y'], ['z', 'z']])],
          ['X', 'Vector']],
   output: 'Number',
   suppressLua: true,
   tooltip:
   'Get the specified co-ordinate from the vector.'}];

Blockly.ComputerCraft.VECTOR_FUNCS_.forEach(function(info) {
  Blockly.ComputerCraft.buildValueBlock(
    'vector', Blockly.ComputerCraft.VECTOR_BLOCK_COLOUR_, info);});

Blockly.Lua['vector_get_coord'] = function(block) {
  var code = Blockly.Lua.valueToCode(block, 'X', Blockly.Lua.ORDER_NONE) +
      '["' + block.getTitleValue('COORD') + '"]';
  return [code, Blockly.Lua.ORDER_HIGH];
};
