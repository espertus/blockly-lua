/**
 * Blockly Lua: ComputerCraft tests
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
 * @fileoverview Test blocks for ComputerCraft.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

Blockly.ComputerCraft.buildDependentInputBlock(
  'test',
  200, {
    funcName: 'vote',
    text: 'Vote for %1: %2 %3',
    args: [['OFFICE', [['President', 'president'],
                       ['Vice President', 'vp']]],
           ['CANDIDATE*', [['George Washington', 'washington*'],
                          ['Abraham Lincoln', 'lincoln'],
                          ['write-in candidate', 'writein']]],
           ['WRITE_IN^', 'String']]
});

Blockly.ComputerCraft.buildDependentInputBlock(
  'test',
  200, {
    funcName: 'count',
    text: '%1 %2',
    args: [['ENABLE*', [['Disable dependent input', 'disable'],
                       ['Enable dependent input', 'enable*']]],
           ['AMOUNT^', 'Number']],
    addChild: Blockly.ComputerCraft.InputAddType.FIRST});

Blockly.ComputerCraft.buildVarArgsBlock(
  'test',
  200,
  {blockName: 'varargs',
   funcName: 'giveMeMore',
   text: 'give me more %v',
   varArgName: 'argument',
   varArgType: 'String',
   varContainerName: 'arguments'});
