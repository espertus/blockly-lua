/**
 * Blockly Lua: ComputerCraft Paintutils API
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
 * @fileoverview Blocks for ComputerCraft Paintutils API
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.require('ComputerCraft.ValueBlock');

Blockly.ComputerCraft.PAINTUTILS_BLOCK_COLOUR_ = 310;

Blockly.ComputerCraft.PAINTUTILS_FUNCS_ = [
  {funcName: 'loadImage',
   text: 'load image from path %1',
   args: [['PATH', 'String']],
   output: 'Image',
   tooltip:
   'Load an image object from the specified path.'},
  {funcName: 'drawImage',
   text: 'draw image %1 at (%2, %3)',
   args: [['IMAGE', 'Image'],
          ['X', 'Number'],
          ['Y', 'Number']],
   tooltip:
   'Draw an image at the specified (x, y) coordinates.\n' +
   'An image can be obtained with the "load image" block.'},
  {funcName: 'drawPixel',
   text: 'draw %3 pixel at (%1, %2)',
   args: [['X', 'Number'],
          ['Y', 'Number'],
          ['COLOUR', 'Colour']],
   tooltip:
   'Draw a pixel (dot) at the specified (x, y) coordinates\n' +
   'in the specified colour.'},
  {funcName: 'drawLine',
   text: 'draw %5 line from (%1, %2) to (%3, %4)',
   args: [['X1', 'Number'],
          ['Y1', 'Number'],
          ['X2', 'Number'],
          ['Y2', 'Number'],
          ['COLOUR', 'Colour']],
   tooltip:
   'Draw a line in the specified colour from the first pair\n' +
   'of (x, y) coordinates to the second pair of (x, y) coordinates.'}];

Blockly.ComputerCraft.PAINTUTILS_FUNCS_.forEach(function(info) {
  Blockly.ComputerCraft.buildValueBlock(
    'paintutils', Blockly.ComputerCraft.PAINTUTILS_BLOCK_COLOUR_, info);});
