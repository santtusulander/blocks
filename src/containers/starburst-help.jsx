import React from 'react'
import { withRouter, routerShape } from 'react-router'
import { Button } from 'react-bootstrap'
import IconArrowLeft from '../components/shared/icons/icon-arrow-left'

import { FormattedMessage } from 'react-intl'

const StarburstHelp = ({router}) => {
  return (
    <div className='help-overlay'>
      <div className="starburst-help-container">
        <Button bsStyle="primary" className="has-icon"
          onClick={router.goBack}>
          <IconArrowLeft/>
          <FormattedMessage id="portal.button.back"/>
        </Button>
      </div>
      <div className="starburst-help-container">
        <div className="help-example"/>
        <div className="help-detail"/>
        <svg className="help-svg" x="0px" y="0px" viewBox="0 0 2061 1271">
          {/* Date labels */}
          <text transform="matrix(1 0 0 1 851.9116 373.5339)">
            <FormattedMessage tagName="tspan" id="portal.startburstHelp.today.text"/>
          </text>
          <text transform="matrix(1 0 0 1 1198.3925 706.3748)">
            <FormattedMessage tagName="tspan" id="portal.starburst.help.mock.date1"/>
          </text>
          <text transform="matrix(1 0 0 1 844.085 1037.5986)">
            <FormattedMessage tagName="tspan" id="portal.starburst.help.mock.date2"/>
          </text>
          <text transform="matrix(1 0 0 1 526.9711 706.3748)">
            <FormattedMessage tagName="tspan" id="portal.starburst.help.mock.date3"/>
          </text>
          {/* Detail image pointer*/}
          <line className="pointer" x1="1086.9" y1="517.2" x2="1529.7" y2="341.1"/>
          <circle opacity="0.3" fill="#00A9D4" cx="1039.7" cy="536" r="50.8"/>
          <circle className="pointer" cx="1039.7" cy="536" r="50.8"/>
          {/* Health ring */}
          <g>
            <text transform="matrix(1 0 0 1 1540.6591 663.3898)"
              className="heading">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.healthRing.text"/>
            </text>
            {/* Color circles*/}
            <circle fill="#89BA17" cx="1560.7" cy="724.8" r="20"/>
            <circle fill="#00A9D4" cx="1560.7" cy="823.1" r="20"/>
            <circle fill="#7B0663" cx="1560.7" cy="921.5" r="20"/>
            <circle cx="1560.7" cy="1018.1" r="20"/>
            {/* Descriptions */}
            <text transform="matrix(1 0 0 1 1620.0648 717.5681)">
              <tspan x="0" y="0"><FormattedMessage tagName="tspan" id="portal.starburst.help.mock.moreTraffic1" /></tspan>
              <tspan x="0" y="28"><FormattedMessage tagName="tspan" id="portal.starburst.help.mock.moreTraffic2" /></tspan>
            </text>
            <text transform="matrix(1 0 0 1 1620.0648 815.0632)">
              <tspan x="0" y="0"><FormattedMessage tagName="tspan" id="portal.starburst.help.mock.sameTraffic1" /></tspan>
              <tspan x="0" y="28"><FormattedMessage tagName="tspan" id="portal.starburst.help.mock.sameTraffic2" /></tspan>
            </text>
            <text transform="matrix(1 0 0 1 1620.0648 913.2663)">
              <tspan x="0" y="0"><FormattedMessage tagName="tspan" id="portal.starburst.help.mock.lessTraffic1" /></tspan>
              <tspan x="0" y="28"><FormattedMessage tagName="tspan" id="portal.starburst.help.mock.lessTraffic2" /></tspan>
            </text>
            <text transform="matrix(1 0 0 1 1620.0648 1025.8904)">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.noData.text"/>
            </text>
            {/* Pointer */}
            <line className="pointer" x1="1560.7" y1="428.1"
              x2="1560.7" y2="597.7"/>
            <circle className="pointer-dot" cx="1560.7" cy="428.1" r="3.8"/>
          </g>
          {/* Blue Lines*/}
          <g>
            <text transform="matrix(1 0 0 1 1780.0575 281.6164)"
              className="heading">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.blueLines.text"/>
            </text>
            {/* Pointer */}
            <line className="pointer"
              x1="1588" y1="317.6" x2="1762.6" y2="317.6"/>
            <circle className="pointer-dot" cx="1588" cy="317.6" r="3.8"/>
            {/* Description */}
            <text transform="matrix(1 0 0 1 1780.057 324.5964)">
              <tspan x="0" y="0">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.eachLine.text"/>
              </tspan>
              <tspan x="0" y="28">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.relativeBandwidth.text"/>
              </tspan>
              <tspan x="0" y="56">
                 <FormattedMessage tagName="tspan" id="portal.startburstHelp.4hour.text"/>
              </tspan>
              <tspan x="0" y="84">
                 <FormattedMessage tagName="tspan" id="portal.startburstHelp.period.text"/>
              </tspan>
            </text>
          </g>
          {/* Blue Halo */}
          <g>
            <text transform="matrix(1 0 0 1 1083.8729 212.6252)"
              className="heading">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.blueHalo.text"/>
            </text>
            {/* Description */}
            <text transform="matrix(1 0 0 1 1083.8729 255.6057)">
              <tspan x="0" y="0">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.comparisonPeriod.text"/>
              </tspan>
              <tspan x="0" y="28">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.prev28.text"/>
              </tspan>
            </text>
            {/* Pointer */}
            <line className="pointer"
              x1="1470.2" y1="249.6" x2="1306.4" y2="249.6"/>
            <circle className="pointer-dot" cx="1470" cy="249.6" r="3.8"/>
          </g>
          {/* Action Buttons */}
          <g>
            <text transform="matrix(1 0 0 1 0 877)"
              className="heading">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.actionButtons.text"/>
            </text>
            {/* Pointer */}
            <line className="pointer"
              x1="730" y1="797" x2="184" y2="1037"/>
            <circle className="pointer-dot" cx="730" cy="797" r="3.8"/>
            {/* Description */}
            <text transform="matrix(1 0 0 1 82 945)">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.metrics.text"/>
            </text>
            <text transform="matrix(1 0 0 1 82 1043)">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.settings.text"/>
            </text>
            <text transform="matrix(1 0 0 1 82 1142)">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.help.text"/>
            </text>
            {/* Metrics Icon */}
            <g className="example-icon">
              <circle cx="30" cy="940" r="30"/>
              <path d="M21,940c0.1,0,0.1,0,0.1,0v11.6c0,0-0.1,0-0.1,0h-4.4c-0.1,0-0.1,0-0.1,0v-11.6c0,0,0.1,0,0.1,0
                H21.7z"/>
              <path d="M32,928c0.1,0,0.1,0,0.1,0.1v23.2c0,0-0.1,0.1-0.1,0.1h-4.4c-0.1,0-0.1,0-0.1-0.1v-23.2
                c0,0,0.1-0.1,0.1-0.1H32.2z"/>
              <path d="M42,934c0.1,0,0.1,0,0.1,0v17.4c0,0-0.1,0-0.1,0h-4.4c-0.1,0-0.1,0-0.1,0v-17.4c0,0,0.1,0,0.1,0
                H42.7z"/>
            </g>
            {/* Settings Icon*/}
            <g className="example-icon">
              <circle cx="30" cy="1037" r="30"/>
              <path d="M45,1035.8l-2.1-6l-4.8,0.4c0,0,0-0.1-0.1-0.1l1-4.9l-5.7-2.8l-3.1,3.7c-0.1,0-0.1,0-0.2,0c0,0,0,0,0,0
                l-2.8-4.3l-6,2.1l0.4,5c0,0,0,0,0,0l-5-1.1l-2.8,5.7l3.8,3.2c0,0.1,0,0.1,0,0.2l-4.3,2.10l2.1,6l5.1-0.5c0,0,0,0,0,0l-1.1,5.1
                l5.7,2.8l3.3-4c0,0,0.1,0,0.1,0l2.9,4.4l6-2.1l-0.5-5.3l5.1,1.1l2.8-5.7l-3.8-3.2L45.8,1035.8z M30,1044.3c-3.7,0-6.6-3-6.6-6.6
                c0-3.7,3-6.6,6.6-6.6c3.7,0,6.6,3,6.6,6.6C36.6,1041.3,33.7,1044.3,30,1044.3z"/>
            </g>
            {/* Help Icon */}
            <g className="example-icon">
              <circle cx="30" cy="1134" r="30"/>
              <text transform="matrix(1 0 0 1 22 1145)">
                <FormattedMessage tagName="tspan" id="portal.question" />
              </text>
            </g>
          </g>
          {/* Starburst */}
          <g>
            <text transform="matrix(1 0 0 1 0 309)"
              className="heading">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.starburst.text"/>
            </text>
            {/* Pointer */}
            <line className="pointer" x1="832" y1="563" x2="464" y2="374"/>
            <circle className="pointer-dot" cx="832" cy="563" r="3.8"/>
            {/* Description */}
            <text transform="matrix(1 0 0 1 0 353)">
              <tspan x="0" y="0">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.prior4weeksBandwidth.text"/>
              </tspan>
              <tspan x="0" y="28">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.prior4weeksBandwidthCacheHit.text"/>
              </tspan>
              <tspan x="0" y="56">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.prior4weeksBandwidthFttb.text"/>
              </tspan>
              <tspan x="0" y="98">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.sortingNote.text"/>
              </tspan>
              <tspan x="0" y="126">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.notRepresentative.text"/>
              </tspan>
              <tspan x="0" y="154">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.displayedOnStarburst.text"/>
              </tspan>
            </text>
          </g>
          {/* Day Wedge */}
          <g>
            <text transform="matrix(1 0 0 1 438 184)"
              className="heading">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.dayWedge.text"/>
            </text>
            {/* Pointer */}
            <line className="pointer" x1="886" y1="417"
              x2="697" y2="256"/>
            <circle className="pointer-dot" cx="886" cy="417" r="3.8"/>
            {/* Descrition */}
            <text transform="matrix(1 0 0 1 440 228)">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.wedgeDisclaimer.text"/>
            </text>
          </g>
          {/* TTFB */}
          <g>
            <text transform="matrix(1 0 0 1 1038 1104)"
              className="heading">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.ttfb.text"/>
            </text>
            {/* Pointer */}
            <line className="pointer" x1="950" y1="707"
              x2="1197" y2="1066"/>
            <circle className="pointer-dot" cx="950" cy="707" r="3.8"/>
            {/* Descrition */}
            <text transform="matrix(1 0 0 1 1040 1148)">
              <tspan x="0" y="0">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.latency.text"/>
              </tspan>
              <tspan x="0" y="28">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.content.text"/>
              </tspan>
            </text>
          </g>
          {/* Cache Hit Rate */}
          <g>
            <text transform="matrix(1 0 0 1 0 609)"
              className="heading">
              <FormattedMessage tagName="tspan" id="portal.startburstHelp.cacheHitRate.text"/>
            </text>
            {/* Pointer */}
            <line className="pointer" x1="765" y1="680" x2="514" y2="650"/>
            <circle className="pointer-dot" cx="765" cy="680" r="3.8"/>
            {/* Description */}
            <text transform="matrix(1 0 0 1 0 653)">
              <tspan x="0" y="0">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.percentageServed.text"/>
              </tspan>
              <tspan x="0" y="28">
                <FormattedMessage tagName="tspan" id="portal.startburstHelp.backToOrigin.text"/>
              </tspan>
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

StarburstHelp.displayName = 'StarburstHelp'
StarburstHelp.propTypes = {
  router: routerShape
}

export default withRouter(StarburstHelp)
