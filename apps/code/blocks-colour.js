/**
 * Blockly Apps: Blocklycraft
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
 * @fileoverview Colour blocks for ComputerCraft.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */

/**
 * An array of colours for the palette.  The rgb attributes may be tweaked,
 * but the value attributes must not, since they correspond to ones on
 * "http://computercraft.info/wiki/Colors_%28API%29".
 */
var COLOURS_ = [
  // WHITE
  { rgb: '#ffffff', value: 1 << 0 },
  // ORANGE
  { rgb: '#ffa000', value: 1 << 1 },
  // MAGENTA
  { rgb: '#ff00ff', value: 1 << 2 },
  // LIGHT_BLUE
  { rgb: '#87ceeb', value: 1 << 3 },
  // YELLOW
  { rgb: '#ffff00', value: 1 << 4 },
  // LIME
  { rgb: '#32cd32', value: 1 << 5 },
  // PINK
  { rgb: '#ff77ff', value: 1 << 6 },
  // GREY
  { rgb: '#808080', value: 1 << 7 },
  // LIGHT_GREY
  { rgb: '#d3d3d3', value: 1 << 8 },
  // CYAN
  { rgb: '#00ffff', value: 1 << 9 },
  // PURPLE
  { rgb: '#a020f0', value: 1 << 10 },
  // BLUE
  { rgb: '#0000cd', value: 1 << 11 },
  // BROWN
  { rgb: '#8b4513', value: 1 << 12 },
  // GREEN
  { rgb: '#228b22', value: 1 << 13 },
  // RED
  { rgb: '#ff0000', value: 1 << 14 },
  // BLACK
  { rgb: '#000000', value: 1 << 15 }
];

/**
 * The order in which colours should appear on the palette.
 * Array.prototype.map is supported by IE 9+ and all other major browsers.
 * This overrides a value defined in core/field_colour.js
 * (via blockly_[un]compressed.js).
 */
Blockly.FieldColour.COLOURS = COLOURS_.map(function(c) {return c.rgb;});

/**
 * Number of columns in the palette.
 * This overrides a value defined in core/field_colour.js
 * (via blockly_[un]compressed.js).
 */
Blockly.FieldColour.COLUMNS = 4;

/**
 * Return the current colour as a ComputerCraft value.
 * See "http://computercraft.info/wiki/Colors_%28API%29".
 * This overrides an existing method in core/field_colour.js.
 *
 * @return {string} Current colour as ComputerCraft value.
 */
Blockly.FieldColour.prototype.getValue = function() {
  for (int i = 0; i < COLOURS_.length; i++) {
    var entry = COLOURS_[i];
    if (entry.rgb == this.colour_) {
      return entry.value;
    }
  }
  // This line shouldn't be reached.  Return the first colour if it is.
  return COLOURS_[0].value;
};
