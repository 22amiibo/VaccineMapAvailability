import * as React from 'react';

const FilterPanel = ({ onFiltersChange }) => {
  const [region, setRegion] = React.useState('All');
  const [coverageRange, setCoverageRange] = React.useState([0, 100]);
  const [showConflictOnly, setShowConflictOnly] = React.useState(false);

  const update = (newState) =>
    onFiltersChange({ region, coverageRange, showConflictOnly, ...newState });

  return (
    <div>
      <h2>Filters</h2>
      <div>
        <label>Region</label>
        <select
          value={region}
          onChange={(e) => {
            setRegion(e.target.value);
            update({ region: e.target.value });
          }}
        >
          <option value="All">All</option>
          <option value="Asia-Pacific">Asia-Pacific</option>
          <option value="Americas">Americas</option>
          <option value="Europe">Europe</option>
          <option value="Middle East & North Africa">Middle East & North Africa</option>
          <option value="Africa">Africa</option>
        </select>
      </div>

      <div>
        <label>Coverage Range</label>
        <input
          type="range"
          min="0"
          max="100"
          value={coverageRange[0]}
          onChange={(e) => {
            const value = Number(e.target.value);
            const newRange = [value, coverageRange[1]];
            setCoverageRange(newRange);
            update({ coverageRange: newRange });
          }}
        />
        <div>
          {coverageRange[0]} - {coverageRange[1]}
        </div>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={showConflictOnly}
            onChange={(e) => {
              setShowConflictOnly(e.target.checked);
              update({ showConflictOnly: e.target.checked });
            }}
          />
          Show Conflict Only
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;
