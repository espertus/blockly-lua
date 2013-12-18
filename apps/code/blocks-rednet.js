/**
 * Blockly Lua: ComputerCraft Rednet API
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
 * @fileoverview Blocks for ComputerCraft Rednet API
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.require('ComputerCraft.DependentInputBlock');
goog.require('ComputerCraft.ValueBlock');

Blockly.ComputerCraft.REDNET_BLOCK_COLOUR_ = 290;

Blockly.ComputerCraft.REDNET_FUNCS_ = [
  {funcName: 'open',
   text: 'open rednet on %1',
   args: [['SIDE', new Blockly.FieldDropdown(Blockly.ComputerCraft.ValueBlock.SIDES)]],
   tooltip:
   'Tell the computer that the side can be used for networking.'},
  {funcName: 'close',
   text: 'close rednet on %1',
   args: [['SIDE', new Blockly.FieldDropdown(Blockly.ComputerCraft.ValueBlock.SIDES)]],
   tooltip:
   'Tell the computer that the side can no longer be used for networking.'},
  {funcName: 'isOpen',
   text: 'is rednet open on %1?',
   args: [['SIDE', new Blockly.FieldDropdown(Blockly.ComputerCraft.ValueBlock.SIDES)]],
   output: 'Boolean',
   tooltip:
   'Check if rednet is open on the specified side.'},
  {funcName: 'run',
   text: 'run rednet',
   tooltip: 'Run rednet.'}];

Blockly.ComputerCraft.REDNET_FUNCS_.forEach(function(info) {
  Blockly.ComputerCraft.buildValueBlock(
    'rednet', Blockly.ComputerCraft.REDNET_BLOCK_COLOUR_, info);});

Blockly.ComputerCraft.buildDependentInputBlock(
  'rednet',
  Blockly.ComputerCraft.REDNET_BLOCK_COLOUR_,
  {blockName: 'broadcast',
   text:'broadcast %1 %2 on rednet',
   args: [['OPTION*',
           [['empty message', 'announce'],
            ['message', 'broadcast*']]],
          ['MESSAGE^', 'String']],
   ddFuncName: 'OPTION'});

Blockly.ComputerCraft.buildDependentInputBlock(
  'rednet',
  Blockly.ComputerCraft.REDNET_BLOCK_COLOUR_,
  {funcName: 'receive',
   text:'wait %1 %2 for rednet message',
   args: [['SECONDS^', 'Number'],
          ['OPTION*',
           [['forever', 'forever'],
            ['seconds', 'seconds*']]]],
   multipleOutputs: 3});
