import { ColumnInspector } from './dimension-inspectors/column.inspector.js';
import { GridInspector } from './dimension-inspectors/grid.inspector.js';
import { RowInspector } from './dimension-inspectors/row.inspector.js';

export const PuzzleInspector = (function () {
  const inspectionPipeline = [RowInspector, ColumnInspector, GridInspector];

  function hasDuplicates(puzzle, coordinates, cell) {
    return inspectionPipeline.some((inspector) =>
      inspector.hasDuplicates(puzzle, coordinates, cell)
    );
  }

  return { hasDuplicates };
})();
