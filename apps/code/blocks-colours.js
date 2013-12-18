/**
 * Blockly Lua: ComputerCraft Colours API
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
 * @fileoverview Colours blocks for ComputerCraft.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.require('ComputerCraft.ValueBlock');
goog.require('ComputerCraft.VarArgsBlock');

Blockly.ComputerCraft.COLOURS_BLOCK_COLOUR_ = 80;

/**
 * An array of colours for the palette.  The rgb attributes may be tweaked,
 * but the value attributes must not, since they correspond to ones on
 * "http://computercraft.info/wiki/Colors_%28API%29".
 */
var COLOURS_ = {
  white: {rgb: '#f0f0f0', value: 1 << 0 },
  orange: {rgb: '#f2b233', value: 1 << 1 },
  magenta: {rgb: '#e57fd8', value: 1 << 2 },
  lightBlue: {rgb: '#99b2f2', value: 1 << 3 },
  yellow: {rgb: '#dede6c', value: 1 << 4 },
  lime: {rgb: '#7fcc19', value: 1 << 5 },
  pink: {rgb: '#f2b2cc', value: 1 << 6 },
  grey: {rgb: '#4c4c4c', value: 1 << 7 },
  lightGrey: {rgb: '#999999', value: 1 << 8 },
  cyan: {rgb: '#4c99b2', value: 1 << 9 },
  purple: {rgb: '#b266e5', value: 1 << 10 },
  blue: {rgb: '#253192', value: 1 << 11 },
  brown: {rgb: '#7f664c', value: 1 << 12 },
  green: {rgb: '#57a64e', value: 1 << 13 },
  red: {rgb: '#cc4c4c', value: 1 << 14 },
  black: {rgb: '#191919', value: 1 << 15 }
};

/**
 * The order in which colours should appear on the palette.
 * Array.prototype.map is supported by IE 9+ and all other major browsers.
 * This overrides a value defined in core/field_colour.js
 * (via blockly_[un]compressed.js).
 */
Blockly.FieldColour.COLOURS = Object.keys(COLOURS_).map(
  function(name) {
    return COLOURS_[name].rgb;
  });

/**
 * Number of columns in the palette.
 * This overrides a value defined in core/field_colour.js
 * (via blockly_[un]compressed.js).
 */
Blockly.FieldColour.COLUMNS = 4;

Blockly.Blocks['colours_picker'] = {
  // Colour picker.
  init: function() {
    this.setHelpUrl('http://computercraft.info/wiki/Colors_%28API%29');
    this.setColour(Blockly.ComputerCraft.COLOURS_BLOCK_COLOUR_);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldColour('#cc4c4c'), 'COLOUR');
    this.setOutput(true, 'Number');
    this.setTooltip(
      'Choose among colours (from left to right, top to bottom):\n' +
      'white, orange, magenta, light blue,\n' +
      'yellow, lime, pink, grey,\n' +
      'light gray, cyan purple, blue,\n' +
      'brown, green, red, black.');
  }
};

// TODO: Change block colour to match chosen colour, if not too hard.  Neil?
Blockly.ComputerCraft.buildValueBlock(
  'colours',
  Blockly.ComputerCraft.COLOURS_BLOCK_COLOUR_,
  {blockName: 'list',
   text: '%1',
   args: [['COLOUR',
           new Blockly.FieldDropdown(Object.keys(COLOURS_).map(
             function(name) {
               return [Blockly.ComputerCraft.convertFromCamelCase(name).
                       replace('_', ' '),
                       name];
             }))]],
   output: 'Number',
   tooltip: 'Choose among colours by name.'});

Blockly.Lua['colours_list'] = function(block) {
  var code = 'colours.' + block.getTitleValue('COLOUR');
  return [code, Blockly.Lua.ORDER_HIGH];
};

Blockly.Lua['colours_picker'] = function(block) {
  // Generate Lua code for the selected ComputerCraft colour.
  var colour = block.inputList[0].titleRow[0].colour_;
  var keys = Object.keys(COLOURS_);
  for (var x = 0; x < keys.length; x++) {
    var key = keys[x];
    var entry = COLOURS_[key];
    if (entry.rgb == colour) {
      return ['colours.' + key, Blockly.Lua.ORDER_HIGH];
    }
  }
  goog.asserts.fail('Error in colour_picker');
};

Blockly.ComputerCraft.buildVarArgsBlock(
  'colours',
  Blockly.ComputerCraft.COLOURS_BLOCK_COLOUR_,
  {funcName: 'combine',
   text: 'combine colours %v into set',
   varArgName: 'colour',
   varArgType: 'Number',
   varArgTooltip: 'A colour to add to the set.',
   varArgCount: 2,
   varContainerName: 'colours',
   varContainerTooltip: 'Add or remove colours.',
   output: 'Number',
   tooltip:
   'Combine one or more colours (or sets of colours) into a set.\n' +
   'To change the number of colours, click on the star.'});

Blockly.ComputerCraft.buildVarArgsBlock(
  'colours',
  Blockly.ComputerCraft.COLOURS_BLOCK_COLOUR_,
  {funcName: 'subtract',
   text: 'subtract colours %v from set %1',
   args: [['Set', 'Number']],
   varArgName: 'colour',
   varArgType: 'Number',
   varArgTooltip: 'A colour to subtract.',
   varArgCount: 1,
   varContainerName: 'colours to remove',
   varContainerTooltip: 'Add or remove colours.',
   output: 'Number',
   tooltip:
   'Remove one or more colours from the specified set of colours.\n' +
   'To change the number of colours to remove, click on the star.\n' +
   'A set can be built with the "combine" block.'});

Blockly.ComputerCraft.buildValueBlock(
  'colours',
  Blockly.ComputerCraft.COLOURS_BLOCK_COLOUR_,
  {funcName: 'test',
   text: 'is colour %2 in set %1?',
   args: [['Set', 'Number'],
          ['Colour', 'Number']],
   output: 'Boolean',
   tooltip:
   'Test whether the given colour is in the set.\n' +
   'A set can be built with the "combine" block.'});
