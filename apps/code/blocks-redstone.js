/**
 * Blockly Lua: ComputerCraft Redstone API
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
 * @fileoverview Blocks for ComputerCraft Redstone API
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.require('ComputerCraft.ValueBlock');

Blockly.ComputerCraft.REDSTONE_BLOCK_COLOUR_ = 290;

Blockly.ComputerCraft.REDSTONE_FUNCS_ = [
  {funcName: 'getSides',
   text: 'get sides',
   output: 'Table',
   tooltip:
   'Get a table whose values are the names of the sides\n' +
   '(top, bottom, left, right, front, and back) through\n' +
   'which RedPower cables and redstone could be connected.'},
  {blockName: 'get_input',
   text: 'get %1 redstone signal through %2',
   args: [['OPTION',
           new Blockly.FieldDropdown(
             [['digital', 'getInput'],
              ['analog', 'getAnalogInput']],
             function(value) {
               this.sourceBlock_.changeOutput(
                   value == 'getInput' ? 'Boolean' : 'Number');
             })],
          ['SIDE', new Blockly.FieldDropdown(Blockly.ComputerCraft.ValueBlock.SIDES)]],
   ddFuncName: 'OPTION',
   output: 'Boolean',
   tooltip:
   'Get the redstone signal from the cable on the specified side.\n' +
   'Digital signals are either of the boolean values "true" or "false".\n' +
   'Analog signals are in the numeric range 0-15.'},
  {blockName: 'set_output',
   text: 'output %1 signal %3 through %2',
   args: [['OPTION',
           new Blockly.FieldDropdown(
             [['digital', 'setOutput'],
              ['analog', 'setAnalogOutput']],
             function(value) {
               this.sourceBlock_.getInput('SIGNAL').setCheck(
                 value == 'setOutput' ? 'Boolean' : 'Number');
             })],
          ['SIDE', new Blockly.FieldDropdown(Blockly.ComputerCraft.ValueBlock.SIDES)],
          ['SIGNAL', 'Boolean']],
   ddFuncName: 'OPTION',
   tooltip:
   'Output the specified signal through an attached redstone cable.\n' +
   'Digital signals are either of the boolean values "true" or "false".\n' +
   'Analog signals are numbers in the range 0-15.'},
  {blockName: 'get_bundled_input',
   text: 'get %1 colours on bundled cable on %2',
   args: [['OPTION',
           new Blockly.FieldDropdown([['all', 'getBundledInput'],
                                      ['activated', 'getBundledOutput']])],
          ['SIDE', new Blockly.FieldDropdown(Blockly.ComputerCraft.ValueBlock.SIDES)]],
   ddFuncName: 'OPTION',
   output: 'Number',
   tooltip:
   'Get the set of colours either present (all) or activated\n' +
   'on a RedPower bundled cable connected on the specified side.'},
  {funcName: 'setBundledOutput',
   text: 'activate colours %2 on bundled cable on %1',
   args: [['SIDE', new Blockly.FieldDropdown(Blockly.ComputerCraft.ValueBlock.SIDES)],
          ['COLOURS', 'Number']],
   tooltip:
   'Activate the specified coloured wires in the attached bundled cable.\n' +
   'The colour input may be an individual colour, the sum of colours, or\n' +
   'a set of colours, created with the "combine" block in the "Colours" drawer.'},
  {funcName: 'testBundledInput',
   text: 'is colour %2 active on bundled cable on %1?',
   args: [['SIDE', new Blockly.FieldDropdown(Blockly.ComputerCraft.ValueBlock.SIDES)],
          ['COLOURS', 'Number']],
   output: 'Boolean',
   tooltip:
   'Has the value "true" if the specified colour is\n' +
   'active in the attached bundled cable; otherwise, false.'}];

Blockly.ComputerCraft.REDSTONE_FUNCS_.forEach(function(info) {
  Blockly.ComputerCraft.buildValueBlock(
    'redstone', Blockly.ComputerCraft.REDSTONE_BLOCK_COLOUR_, info);});
