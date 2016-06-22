import React from 'react'

class StarburstHelp extends React.Component {
  render() {
    return (
      <div className="starburst-help-container">
        <div className="help-example"/>
        <div className="help-detail"/>
        <svg x="0px" y="0px" viewBox="0 0 2061.3 1071.9">
          {/* Date labels */}
          <text transform="matrix(1 0 0 1 851.9116 373.5339)">
            Today
          </text>
          <text transform="matrix(1 0 0 1 1198.3925 706.3748)">
            6/21/16
          </text>
          <text transform="matrix(1 0 0 1 844.085 1037.5986)">
            6/14/16
          </text>
          <text transform="matrix(1 0 0 1 526.9711 706.3748)">
            6/1/16
          </text>
          {/* Detail image pointer*/}
          <line className="pointer" x1="1086.9" y1="517.2" x2="1529.7" y2="341.1"/>
          <circle opacity="0.3" fill="#00A9D4" cx="1039.7" cy="536" r="50.8"/>
          <circle className="pointer" cx="1039.7" cy="536" r="50.8"/>
          {/* Health ring */}
          <g>
            <text transform="matrix(1 0 0 1 1540.6591 663.3898)"
              className="heading">
              Health Ring
            </text>
            {/* Color circles*/}
            <circle fill="#89BA17" cx="1560.7" cy="724.8" r="20"/>
            <circle fill="#00A9D4" cx="1560.7" cy="823.1" r="20"/>
            <circle fill="#7B0663" cx="1560.7" cy="921.5" r="20"/>
            <circle cx="1560.7" cy="1018.1" r="20"/>
            {/* Descriptions */}
            <text transform="matrix(1 0 0 1 1620.0648 717.5681)">
              <tspan x="0" y="0">More traffic during that week the </tspan>
              <tspan x="0" y="28">previous month</tspan>
            </text>
            <text transform="matrix(1 0 0 1 1620.0648 815.0632)">
              <tspan x="0" y="0">Same amount of traffic during that week </tspan>
              <tspan x="0" y="28">the previous month</tspan>
            </text>
            <text transform="matrix(1 0 0 1 1620.0648 913.2663)">
              <tspan x="0" y="0">Less traffic during that week the </tspan>
              <tspan x="0" y="28">previous month</tspan>
            </text>
            <text transform="matrix(1 0 0 1 1620.0648 1025.8904)">
              No data
            </text>
            {/* Pointer */}
            <line className="pointer" x1="1560.7" y1="422.9"
              x2="1560.7" y2="597.7"/>
            <circle className="pointer-dot" cx="1560.7" cy="423.1" r="3.8"/>
          </g>
          {/* Blue Lines*/}
          <g>
            <text transform="matrix(1 0 0 1 1780.0575 281.6164)"
              className="heading">
              Blue Lines
            </text>
            {/* Pointer */}
            <line className="pointer"
              x1="1598.9" y1="317.6" x2="1762.6" y2="317.6"/>
            <circle className="pointer-dot" cx="1599" cy="317.6" r="3.8"/>
            {/* Description */}
            <text transform="matrix(1 0 0 1 1780.057 324.5964)">
              <tspan x="0" y="0">
                Each line represents
              </tspan>
              <tspan x="0" y="28">
                relative bandwidth
              </tspan>
              <tspan x="0" y="56">
                 delivered for a 4-hour
              </tspan>
              <tspan x="0" y="84">
                 period
              </tspan>
            </text>
          </g>
          {/* Blue Halo */}
          <g>
            <text transform="matrix(1 0 0 1 1083.8729 212.6252)"
              className="heading">
              Blue Halo
            </text>
            {/* Description */}
            <text transform="matrix(1 0 0 1 1083.8729 255.6057)">
              <tspan x="0" y="0">
                Comparison period for
              </tspan>
              <tspan x="0" y="28">
                previous 28 days
              </tspan>
            </text>
            {/* Pointer */}
            <line className="pointer"
              x1="1470.2" y1="249.6" x2="1306.4" y2="249.6"/>
            <circle className="pointer-dot" cx="1470" cy="249.6" r="3.8"/>
          </g>
          {/* Action Buttons */}
          <g>
            <text transform="matrix(1 0 0 1 0.659 677.3898)"
              className="heading">
              Action Buttons
            </text>
            {/* Pointer */}
            <line className="pointer"
              x1="764.3" y1="837.7" x2="184.2" y2="837.6"/>
            <circle className="pointer-dot" cx="764.1" cy="837.7" r="3.8"/>
            {/* Description */}
            <text transform="matrix(1 0 0 1 82.8377 745.1872)">
              Metrics
            </text>
            <text transform="matrix(1 0 0 1 82.8377 843.2785)">
              Settings
            </text>
            <text transform="matrix(1 0 0 1 82.8377 942.3439)">
              Help
            </text>
            {/* Metrics Icon */}
            <g className="example-icon">
              <circle cx="30" cy="740.2" r="30"/>
              <path d="M21.7,740.2c0.1,0,0.1,0,0.1,0v11.6c0,0-0.1,0-0.1,0h-4.4c-0.1,0-0.1,0-0.1,0v-11.6c0,0,0.1,0,0.1,0
                H21.7z"/>
              <path d="M32.2,728.5c0.1,0,0.1,0,0.1,0.1v23.2c0,0-0.1,0.1-0.1,0.1h-4.4c-0.1,0-0.1,0-0.1-0.1v-23.2
                c0,0,0.1-0.1,0.1-0.1H32.2z"/>
              <path d="M42.7,734.4c0.1,0,0.1,0,0.1,0v17.4c0,0-0.1,0-0.1,0h-4.4c-0.1,0-0.1,0-0.1,0v-17.4c0,0,0.1,0,0.1,0
                H42.7z"/>
            </g>
            {/* Settings Icon*/}
            <g className="example-icon">
              <circle cx="30" cy="837.7" r="30"/>
              <path d="M45.8,835.8l-2.1-6l-4.8,0.4c0,0,0-0.1-0.1-0.1l1-4.9l-5.7-2.8l-3.1,3.7c-0.1,0-0.1,0-0.2,0c0,0,0,0,0,0
                l-2.8-4.3l-6,2.1l0.4,5c0,0,0,0,0,0l-5-1.1l-2.8,5.7l3.8,3.2c0,0.1,0,0.1,0,0.2l-4.3,2.8l2.1,6l5.1-0.5c0,0,0,0,0,0l-1.1,5.1
                l5.7,2.8l3.3-4c0,0,0.1,0,0.1,0l2.9,4.4l6-2.1l-0.5-5.3l5.1,1.1l2.8-5.7l-3.8-3.2L45.8,835.8z M30,844.3c-3.7,0-6.6-3-6.6-6.6
                c0-3.7,3-6.6,6.6-6.6c3.7,0,6.6,3,6.6,6.6C36.6,841.3,33.7,844.3,30,844.3z"/>
            </g>
            {/* Help Icon */}
            <g className="example-icon">
              <circle cx="30" cy="934.1" r="30"/>
              <text transform="matrix(1 0 0 1 22.8575 945.8971)">
                ?
              </text>
            </g>
          </g>
          {/* Starburst */}
          <g>
            <text transform="matrix(1 0 0 1 0.6595 309.4319)"
              className="heading">
              Starburst
            </text>
            {/* Pointer */}
            <line className="pointer" x1="832.2" y1="563.1" x2="464.7" y2="374.9"/>
            <circle className="pointer-dot" cx="832.1" cy="563" r="3.8"/>
            {/* Description */}
            <text transform="matrix(1 0 0 1 0.659 353.5385)">
              <tspan x="0" y="0">
                Average bandwidth for the prior 4 weeks
              </tspan>
              <tspan x="0" y="28">
                Average Cache Hit Rate for the prior 4 weeks
              </tspan>
              <tspan x="0" y="56">
                Average Time to First Byte for the prior 4 weeks
              </tspan>
            </text>
          </g>
          {/* Day Wedge */}
          <g>
            <text transform="matrix(1 0 0 1 438.6732 184.3342)"
              className="heading">
              Day Wedge
            </text>
            {/* Pointer */}
            <line className="pointer" x1="886.3" y1="417.5"
              x2="697.1" y2="256.3"/>
            <circle className="pointer-dot" cx="886.2" cy="417.4" r="3.8"/>
            {/* Descrition */}
            <text transform="matrix(1 0 0 1 440.6727 228.4406)">
              Each wedge represents one day of data
            </text>
          </g>
        </svg>
      </div>
    );
  }
}

StarburstHelp.displayName = 'StarburstHelp'
StarburstHelp.propTypes = {}

module.exports = StarburstHelp
