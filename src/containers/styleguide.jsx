import React from 'react'
import {connect} from 'react-redux'
import Immutable from 'immutable'
import numeral from 'numeral'
import moment from 'moment'

// React-Bootstrap
// ===============

import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonToolbar,
  Col,
  ControlLabel,
  Dropdown,
  FormControl,
  FormGroup,
  HelpBlock,
  Image,
  InputGroup,
  Label,
  MenuItem,
  NavItem,
  OverlayTrigger,
  Pagination,
  Popover,
  Row,
  Table
} from 'react-bootstrap';

import SectionContainer from '../components/layout/section-container'
import SelectWrapper from '../components/select-wrapper'
import BarChart from '../components/charts/bar-chart'
import StackedAreaChart from '../components/charts/stacked-area-chart'
import LineChart from '../components/charts/line-chart'
import FilterChecklistDropdown from '../components/filter-checklist-dropdown/filter-checklist-dropdown.jsx'
import SelectorComponent from '../components/global-account-selector/selector-component'
import Tabs from '../components/tabs'
import MonthPicker from '../components/month-picker'
import StackedByTimeSummary from '../components/stacked-by-time-summary'
import MiniChart from '../components/mini-chart'
import NumberInput from '../components/number-input'
import SidePanel from '../components/side-panel'
import DashboardPanel from '../components/dashboard/dashboard-panel'
import DashboardPanels from '../components/dashboard/dashboard-panels'
import CustomDatePicker from '../components/custom-date-picker'
import DateRangeSelect from '../components/date-range-select'
import MultiOptionSelector from '../components/multi-option-selector'
import LoadingSpinnerSmall from '../components/loading-spinner/loading-spinner-sm'
import Checkbox from '../components/checkbox'
import Radio from '../components/radio'
import NetworkItem from '../components/network/network-item'
import CsvUploadArea from '../components/network/csv-upload'
import AsperaUpload from '../components/storage/aspera-upload'
import Typeahead from '../components/typeahead'
import StorageKPI from '../components/storage/storage-kpi'
import StorageItemChart from '../components/content/storage-item-chart'

import IconAccount       from '../components/icons/icon-account'
import IconAdd           from '../components/icons/icon-add'
import IconAlerts        from '../components/icons/icon-alerts'
import IconAnalytics     from '../components/icons/icon-analytics'
import IconArrowDown     from '../components/icons/icon-arrow-down'
import IconArrowLgDown   from '../components/icons/icon-arrow-lg-down'
import IconArrowRight     from '../components/icons/icon-arrow-right'
import IconArrowLgRight  from '../components/icons/icon-arrow-lg-right'
import IconArrowLeft     from '../components/icons/icon-arrow-left'
import IconArrowLgUp     from '../components/icons/icon-arrow-lg-up'
import IconArrowUp       from '../components/icons/icon-arrow-up'
import IconCaretRight    from '../components/icons/icon-caret-right'
import IconCaretDown     from '../components/icons/icon-caret-down'
import IconChart         from '../components/icons/icon-chart'
import IconCheck         from '../components/icons/icon-check'
import IconChevronRight  from '../components/icons/icon-chevron-right'
import IconChevronRightBold from '../components/icons/icon-chevron-right-bold'
import IconClose         from '../components/icons/icon-close'
import IconComments      from '../components/icons/icon-comments'
import IconConfiguration from '../components/icons/icon-configuration'
import IconContent       from '../components/icons/icon-content'
import IconDelete        from '../components/icons/icon-delete'
import IconEdit          from '../components/icons/icon-edit'
import IconEmail         from '../components/icons/icon-email'
import IconEricsson      from '../components/icons/icon-ericsson'
import IconExport        from '../components/icons/icon-export'
import IconEye           from '../components/icons/icon-eye'
import IconHeaderCaret   from '../components/icons/icon-header-caret'
import IconIncident      from '../components/icons/icon-incident'
import IconInfo          from '../components/icons/icon-info'
import IconIntegration   from '../components/icons/icon-integration'
import IconItemChart     from '../components/icons/icon-item-chart'
import IconItemList      from '../components/icons/icon-item-list'
import IconPassword      from '../components/icons/icon-password'
import IconProblem       from '../components/icons/icon-problem'
import IconQuestion      from '../components/icons/icon-question'
import IconQuestionMark  from '../components/icons/icon-question-mark'
import IconSecurity      from '../components/icons/icon-security'
import IconSelectCaret   from '../components/icons/icon-select-caret'
import IconServices      from '../components/icons/icon-services'
import IconSupport       from '../components/icons/icon-support'
import IconTask          from '../components/icons/icon-task'
import IconTrash         from '../components/icons/icon-trash'
import IconFile          from '../components/icons/icon-file'
import IconFolder        from '../components/icons/icon-folder'
import Mapbox            from '../components/map/mapbox'

import { formatBytes, formatBitsPerSecond, separateUnit } from '../util/helpers'
import { paleblue, black20, darkblue, tealgreen, yellow, purple } from '../constants/colors'
import DateRanges from '../constants/date-ranges'

const filterCheckboxOptions = Immutable.fromJS([
  { value: 'link1', label: 'Property 1' },
  { value: 'link2', label: 'Property 2' },
  { value: 'link3', label: 'Property 3' },
  { value: 'link4', label: 'Property 4' },
  { value: 'link5', label: 'Property 5' },
  { value: 'link6', label: 'Property 6' },
  { value: 'link7', label: 'Property 7' },
  { value: 'link8', label: 'Property 8' },
  { value: 'link9', label: 'Property 9' }
]);

import * as countriesGeoJSON from '../assets/topo/custom.geo.json';

class Styleguide extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      activeTab: 1,
      showSidePanel: false,
      customDatePickerEndDate: moment().endOf('day'),
      customDatePickerStartDate: moment().startOf('day'),
      datePickerEndDate: moment().utc().endOf('day'),
      datePickerLimit: false,
      datePickerStartDate: moment().utc().startOf('month'),
      filterCheckboxValue: Immutable.fromJS([
        'link1',
        'link2',
        'link3',
        'link4',
        'link5',
        'link6',
        'link7',
        'link8',
        'link9'
      ]),
      multiOptionValues: Immutable.List([ {id: 1, options: [1, 2]} ]),
      numberInputValue: 100
    }
  }

  render() {
    const spDashboardData = {
      "traffic": {
        "bytes": 446265804980374,
        "bytes_net_on": 352569123057670,
        "bytes_net_off": 93696681922704,
        "detail": [
          {
            "timestamp": new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)'),
            "bytes": 92020173697866,
            "bytes_net_on": 71856580682504,
            "bytes_net_off": 20163593015362
          },
          {
            "timestamp": new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)'),
            "bytes": 99672709053865,
            "bytes_net_on": 76848354018252,
            "bytes_net_off": 22824355035613
          },
          {
            "timestamp": new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)'),
            "bytes": 94821186769899,
            "bytes_net_on": 72941835769369,
            "bytes_net_off": 21879351000530
          },
          {
            "timestamp": new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)'),
            "bytes": 117441291619312,
            "bytes_net_on": 90477417340581,
            "bytes_net_off": 26963874278731
          },
          {
            "timestamp": new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)'),
            "bytes": 81546375702611,
            "bytes_net_on": 62160286504951,
            "bytes_net_off": 19386089197660
          },
          {
            "timestamp": new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)'),
            "bytes": 117341539984300,
            "bytes_net_on": 90364165873239,
            "bytes_net_off": 26977374111061
          },
          {
            "timestamp": new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)'),
            "bytes": 94064934029131,
            "bytes_net_on": 72989086766237,
            "bytes_net_off": 21075847262894
          },
          {
            "timestamp": new Date('Thu May 26 2016 19:17:01 GMT-0700 (PDT)'),
            "bytes": 93196929110225,
            "bytes_net_on": 72133332220394,
            "bytes_net_off": 21063596889831
          }
        ]
      }
    }

    const stackedBarChartData = [
      {
        "name": "Datafone Inc.",
        "onNetHttp": 9149792187422,
        "onNetHttps": 4324269843760,
        "offNetHttp": 2297510618946,
        "offNetHttps": 1090755001954
      },
      {
        "name": "AsiaNet",
        "onNetHttp": 58034767339905,
        "onNetHttps": 27260875504858,
        "offNetHttp": 16598076780724,
        "offNetHttps": 6941781887919
      },
      {
        "name": "QXT",
        "onNetHttp": 17640581263893,
        "onNetHttps": 8905041306312,
        "offNetHttp": 4413020296483,
        "offNetHttps": 2063509423994
      },
      {
        "name": "Datafone Inc.",
        "onNetHttp": 9149792187422,
        "onNetHttps": 4324269843760,
        "offNetHttp": 2297510618946,
        "offNetHttps": 1090755001954
      },
      {
        "name": "QXT",
        "onNetHttp": 17640581263893,
        "onNetHttps": 8905041306312,
        "offNetHttp": 4413020296483,
        "offNetHttps": 2063509423994
      }
    ]

    const stackAreaChartWithComparisonData = [
      {
        "timestamp": 1486260000,
        "http": 3566127582,
        "actualTime": 1483581600,
        "https": 1679452266,
        "comparison_http": 3821684113,
        "comparison_https": 1823341606
      },
      {
        "timestamp": 1486263600,
        "http": 3311681980,
        "actualTime": 1483585200,
        "https": 1576673837,
        "comparison_http": 3538905166,
        "comparison_https": 1696118995
      },
      {
        "timestamp": 1486267200,
        "http": 2923902355,
        "actualTime": 1483588800,
        "https": 1307228192,
        "comparison_http": 3322792950,
        "comparison_https": 1526673725
      },
      {
        "timestamp": 1486270800,
        "http": 2678345663,
        "actualTime": 1483592400,
        "https": 1205561150,
        "comparison_http": 3094458770,
        "comparison_https": 1448339959
      },
      {
        "timestamp": 1486274400,
        "http": 2447789111,
        "actualTime": 1483596000,
        "https": 1185005401,
        "comparison_http": 2965569197,
        "comparison_https": 1373895231
      },
      {
        "timestamp": 1486278000,
        "http": 2317788557,
        "actualTime": 1483599600,
        "https": 1090560500,
        "comparison_http": 2794457179,
        "comparison_https": 1306117112
      },
      {
        "timestamp": 1486281600,
        "http": 2251676986,
        "actualTime": 1483603200,
        "https": 1065004945,
        "comparison_http": 2608345352,
        "comparison_https": 1226672352
      },
      {
        "timestamp": 1486285200,
        "http": 2225010310,
        "actualTime": 1483606800,
        "https": 1080004943,
        "comparison_http": 2622234226,
        "comparison_https": 1210561207
      },
      {
        "timestamp": 1486288800,
        "http": 1947231052,
        "actualTime": 1483610400,
        "https": 942782130,
        "comparison_http": 2682790165,
        "comparison_https": 1245005645
      },
      {
        "timestamp": 1486292400,
        "http": 2090565194,
        "actualTime": 1483614000,
        "https": 998337901,
        "comparison_http": 2805568407,
        "comparison_https": 1316117111
      },
      {
        "timestamp": 1486296000,
        "http": 2867790975,
        "actualTime": 1483617600,
        "https": 1257783590,
        "comparison_http": 2940013455,
        "comparison_https": 1421673284
      },
      {
        "timestamp": 1486299600,
        "http": 3040569602,
        "actualTime": 1483621200,
        "https": 1430006650,
        "comparison_http": 3208348144,
        "comparison_https": 1516673601
      },
      {
        "timestamp": 1486303200,
        "http": 3034458610,
        "actualTime": 1483624800,
        "https": 1377784173,
        "comparison_http": 3766128491,
        "comparison_https": 1805008399
      },
      {
        "timestamp": 1486306800,
        "http": 3240015008,
        "actualTime": 1483628400,
        "https": 1543896061,
        "comparison_http": 3683905892,
        "comparison_https": 1767230519
      },
      {
        "timestamp": 1486310400,
        "http": 3548905294,
        "actualTime": 1483632000,
        "https": 1701118904,
        "comparison_http": 4011129469,
        "comparison_https": 1912230957
      },
      {
        "timestamp": 1486314000,
        "http": 3781684165,
        "actualTime": 1483635600,
        "https": 1787230518,
        "comparison_http": 4292241965,
        "comparison_https": 2041120502
      },
      {
        "timestamp": 1486317600,
        "http": 4119463605,
        "actualTime": 1483639200,
        "https": 1896675365,
        "comparison_http": 4420576004,
        "comparison_https": 2061120751
      },
      {
        "timestamp": 1486321200,
        "http": 4152796807,
        "actualTime": 1483642800,
        "https": 1974453495,
        "comparison_http": 4605576696,
        "comparison_https": 2111676365
      },
      {
        "timestamp": 1486324800,
        "http": 4432798122,
        "actualTime": 1483646400,
        "https": 2077231817,
        "comparison_http": 4631132650,
        "comparison_https": 2173898853
      },
      {
        "timestamp": 1486328400,
        "http": 4429464770,
        "actualTime": 1483650000,
        "https": 2043342851,
        "comparison_http": 4627799179,
        "comparison_https": 2149454528
      },
      {
        "timestamp": 1486332000,
        "http": 4297242086,
        "actualTime": 1483653600,
        "https": 2053342780,
        "comparison_http": 4556687636,
        "comparison_https": 2168343301
      },
      {
        "timestamp": 1486335600,
        "http": 4191685996,
        "actualTime": 1483657200,
        "https": 2000564762,
        "comparison_http": 4392797897,
        "comparison_https": 2061676189
      },
      {
        "timestamp": 1486339200,
        "http": 3647794692,
        "actualTime": 1483660800,
        "https": 1667229951,
        "comparison_http": 4141685740,
        "comparison_https": 1931119925
      },
      {
        "timestamp": 1486342800,
        "http": 3411126736,
        "actualTime": 1483664400,
        "https": 1589451800,
        "comparison_http": 3886129025,
        "comparison_https": 1833341824
      },
      {
        "timestamp": 1486346400,
        "http": 2926124390,
        "actualTime": 1483668000,
        "https": 1366673011,
        "comparison_http": 3555571899,
        "comparison_https": 1617229684
      },
      {
        "timestamp": 1486350000,
        "http": 2640567754,
        "actualTime": 1483671600,
        "https": 1242783494,
        "comparison_http": 3263348333,
        "comparison_https": 1541118154
      },
      {
        "timestamp": 1486353600,
        "http": 2743345900,
        "actualTime": 1483675200,
        "https": 1296672574,
        "comparison_http": 3000569431,
        "comparison_https": 1382228632
      },
      {
        "timestamp": 1486357200,
        "http": 2558900777,
        "actualTime": 1483678800,
        "https": 1178338795,
        "comparison_http": 2780012931,
        "comparison_https": 1268339267
      },
      {
        "timestamp": 1486360800,
        "http": 2198899034,
        "actualTime": 1483682400,
        "https": 1036116020,
        "comparison_http": 2522233833,
        "comparison_https": 1185561098
      },
      {
        "timestamp": 1486364400,
        "http": 2057787286,
        "actualTime": 1483686000,
        "https": 990004534,
        "comparison_http": 2396677822,
        "comparison_https": 1131672009
      },
      {
        "timestamp": 1486368000,
        "http": 2381677590,
        "actualTime": 1483689600,
        "https": 1058893726,
        "comparison_http": 2317788474,
        "comparison_https": 1087782724
      },
      {
        "timestamp": 1486371600,
        "http": 2366677576,
        "actualTime": 1483693200,
        "https": 1109449564,
        "comparison_http": 2319455245,
        "comparison_https": 1081671679
      },
      {
        "timestamp": 1486375200,
        "http": 2231676805,
        "actualTime": 1483696800,
        "https": 1029449158,
        "comparison_http": 2841124120,
        "comparison_https": 1322228388
      },
      {
        "timestamp": 1486378800,
        "http": 2351677553,
        "actualTime": 1483700400,
        "https": 1085560491,
        "comparison_http": 3022236272,
        "comparison_https": 1410562124
      },
      {
        "timestamp": 1486382400,
        "http": 2238343653,
        "actualTime": 1483704000,
        "https": 1060004902,
        "comparison_http": 2850013222,
        "comparison_https": 1351672946
      },
      {
        "timestamp": 1486386000,
        "http": 2467789187,
        "actualTime": 1483707600,
        "https": 1142227534,
        "comparison_http": 3108347645,
        "comparison_https": 1452784474
      },
      {
        "timestamp": 1486389600,
        "http": 2908346855,
        "actualTime": 1483711200,
        "https": 1301672674,
        "comparison_http": 3323348734,
        "comparison_https": 1561673880
      },
      {
        "timestamp": 1486393200,
        "http": 3096125504,
        "actualTime": 1483714800,
        "https": 1470562284,
        "comparison_http": 3568905386,
        "comparison_https": 1683341086
      },
      {
        "timestamp": 1486396800,
        "http": 3388904715,
        "actualTime": 1483718400,
        "https": 1552229322,
        "comparison_http": 3757795131,
        "comparison_https": 1781674903
      },
      {
        "timestamp": 1486400400,
        "http": 3606683220,
        "actualTime": 1483722000,
        "https": 1709452370,
        "comparison_http": 3984462795,
        "comparison_https": 1843897437
      },
      {
        "timestamp": 1486404000,
        "http": 3761128278,
        "actualTime": 1483725600,
        "https": 1727230067,
        "comparison_http": 4325575555,
        "comparison_https": 1984453569
      },
      {
        "timestamp": 1486407600,
        "http": 3886128872,
        "actualTime": 1483729200,
        "https": 1796119457,
        "comparison_http": 3447793687,
        "comparison_https": 1665007596
      },
      {
        "timestamp": 1486411200,
        "http": 4105574602,
        "actualTime": 1483732800,
        "https": 1905564309,
        "comparison_http": 2201121137,
        "comparison_https": 1080560485
      },
      {
        "timestamp": 1486414800,
        "http": 4083907735,
        "actualTime": 1483736400,
        "https": 1936675550,
        "comparison_http": 2271121500,
        "comparison_https": 1047227023
      },
      {
        "timestamp": 1486418400,
        "http": 3883351157,
        "actualTime": 1483740000,
        "https": 1850008410,
        "comparison_http": 2272788338,
        "comparison_https": 1062782644
      },
      {
        "timestamp": 1486422000,
        "http": 3765573011,
        "actualTime": 1483743600,
        "https": 1715563400,
        "comparison_http": 2180565639,
        "comparison_https": 1056671500
      },
      {
        "timestamp": 1486425600,
        "http": 3721128370,
        "actualTime": 1483747200,
        "https": 1795008284,
        "comparison_http": 3951129401,
        "comparison_https": 1900008740
      },
      {
        "timestamp": 1486429200,
        "http": 3508904909,
        "actualTime": 1483750800,
        "https": 1653896607,
        "comparison_http": 3768906193,
        "comparison_https": 1710007917
      },
      {
        "timestamp": 1486432800,
        "http": 3122236769,
        "actualTime": 1483754400,
        "https": 1462228801,
        "comparison_http": 3556127395,
        "comparison_https": 1652785323
      },
      {
        "timestamp": 1486436400,
        "http": 2882235525,
        "actualTime": 1483758000,
        "https": 1345561652,
        "comparison_http": 3273348424,
        "comparison_https": 1544451482
      },
      {
        "timestamp": 1486440000,
        "http": 2496122705,
        "actualTime": 1483761600,
        "https": 1127782928,
        "comparison_http": 2704457074,
        "comparison_https": 1266672494
      },
      {
        "timestamp": 1486443600,
        "http": 2222232597,
        "actualTime": 1483765200,
        "https": 1056671489,
        "comparison_http": 2489455900,
        "comparison_https": 1107227360
      },
      {
        "timestamp": 1486447200,
        "http": 2720567979,
        "actualTime": 1483768800,
        "https": 1221116765,
        "comparison_http": 2553900757,
        "comparison_https": 1165560877
      },
      {
        "timestamp": 1486450800,
        "http": 2485567087,
        "actualTime": 1483772400,
        "https": 1213894419,
        "comparison_http": 2411122262,
        "comparison_https": 1111116240
      },
      {
        "timestamp": 1486454400,
        "http": 2123898720,
        "actualTime": 1483776000,
        "https": 978337834,
        "comparison_http": 2470011388,
        "comparison_https": 1165560884
      },
      {
        "timestamp": 1486458000,
        "http": 2100565197,
        "actualTime": 1483779600,
        "https": 1002226841,
        "comparison_http": 2501678110,
        "comparison_https": 1143894159
      },
      {
        "timestamp": 1486461600,
        "http": 2178899006,
        "actualTime": 1483783200,
        "https": 1070560542,
        "comparison_http": 2517233986,
        "comparison_https": 1206116680
      },
      {
        "timestamp": 1486465200,
        "http": 2355566470,
        "actualTime": 1483786800,
        "https": 1116116269,
        "comparison_http": 2650567774,
        "comparison_https": 1272783680
      },
      {
        "timestamp": 1486468800,
        "http": 2639456614,
        "actualTime": 1483790400,
        "https": 1281672589,
        "comparison_http": 2557234030,
        "comparison_https": 1182783293
      },
      {
        "timestamp": 1486472400,
        "http": 2917235593,
        "actualTime": 1483794000,
        "https": 1355561753,
        "comparison_http": 2771123889,
        "comparison_https": 1346117349
      },
      {
        "timestamp": 1486476000,
        "http": 3082792001,
        "actualTime": 1483797600,
        "https": 1458895730,
        "comparison_http": 3011680489,
        "comparison_https": 1474451129
      },
      {
        "timestamp": 1486479600,
        "http": 3352237684,
        "actualTime": 1483801200,
        "https": 1580562822,
        "comparison_http": 3263903852,
        "comparison_https": 1559451638
      },
      {
        "timestamp": 1486483200,
        "http": 3502793990,
        "actualTime": 1483804800,
        "https": 1662229781,
        "comparison_http": 3705017023,
        "comparison_https": 1738896841
      },
      {
        "timestamp": 1486486800,
        "http": 3780017353,
        "actualTime": 1483808400,
        "https": 1755008038,
        "comparison_http": 3947795997,
        "comparison_https": 1843897302
      },
      {
        "timestamp": 1486490400,
        "http": 3913351260,
        "actualTime": 1483812000,
        "https": 1884453180,
        "comparison_http": 4129463390,
        "comparison_https": 1927786555
      },
      {
        "timestamp": 1486494000,
        "http": 4077796479,
        "actualTime": 1483815600,
        "https": 1903897534,
        "comparison_http": 4294464213,
        "comparison_https": 1979453564
      },
      {
        "timestamp": 1486497600,
        "http": 4162241407,
        "actualTime": 1483819200,
        "https": 1946675648,
        "comparison_http": 4277797377,
        "comparison_https": 2060009365
      },
      {
        "timestamp": 1486501200,
        "http": 4167241294,
        "actualTime": 1483822800,
        "https": 1906675537,
        "comparison_http": 4239464164,
        "comparison_https": 2110565377
      },
      {
        "timestamp": 1486504800,
        "http": 4069463127,
        "actualTime": 1483826400,
        "https": 1921120056,
        "comparison_http": 4296131126,
        "comparison_https": 2052787301
      },
      {
        "timestamp": 1486508400,
        "http": 3907795861,
        "actualTime": 1483830000,
        "https": 1843897266,
        "comparison_http": 4191130321,
        "comparison_https": 1992786875
      },
      {
        "timestamp": 1486512000,
        "http": 3762795233,
        "actualTime": 1483833600,
        "https": 1792786062,
        "comparison_http": 3868906684,
        "comparison_https": 1762785953
      },
      {
        "timestamp": 1486515600,
        "http": 3521682845,
        "actualTime": 1483837200,
        "https": 1672785402,
        "comparison_http": 3615572135,
        "comparison_https": 1708341090
      },
      {
        "timestamp": 1486519200,
        "http": 3437793575,
        "actualTime": 1483840800,
        "https": 1585562816,
        "comparison_http": 3471127025,
        "comparison_https": 1630007592
      },
      {
        "timestamp": 1486522800,
        "http": 3141680959,
        "actualTime": 1483844400,
        "https": 1485562502,
        "comparison_http": 3209459206,
        "comparison_https": 1467784597
      },
      {
        "timestamp": 1486526400,
        "http": 2868902087,
        "actualTime": 1483848000,
        "https": 1372228472,
        "comparison_http": 3096125231,
        "comparison_https": 1507784664
      },
      {
        "timestamp": 1486530000,
        "http": 2646123286,
        "actualTime": 1483851600,
        "https": 1254450213,
        "comparison_http": 2848346478,
        "comparison_https": 1376673057
      },
      {
        "timestamp": 1486533600,
        "http": 2103343077,
        "actualTime": 1483855200,
        "https": 923337588,
        "comparison_http": 2416122276,
        "comparison_https": 1178338810
      },
      {
        "timestamp": 1486537200,
        "http": 1928342276,
        "actualTime": 1483858800,
        "https": 923893132,
        "comparison_http": 2298899505,
        "comparison_https": 1087227288
      },
      {
        "timestamp": 1486540800,
        "http": 1728896934,
        "actualTime": 1483862400,
        "https": 853892860,
        "comparison_http": 1926675532,
        "comparison_https": 890559619
      },
      {
        "timestamp": 1486544400,
        "http": 1746674701,
        "actualTime": 1483866000,
        "https": 824448297,
        "comparison_http": 1946120065,
        "comparison_https": 856670549
      },
      {
        "timestamp": 1486548000,
        "http": 2217232372,
        "actualTime": 1483869600,
        "https": 987226691,
        "comparison_http": 2308899502,
        "comparison_https": 1045004736
      },
      {
        "timestamp": 1486551600,
        "http": 2342232982,
        "actualTime": 1483873200,
        "https": 1077782755,
        "comparison_http": 2426122346,
        "comparison_https": 1131116290
      },
      {
        "timestamp": 1486555200,
        "http": 2993347306,
        "actualTime": 1483876800,
        "https": 1415006614,
        "comparison_http": 2937235778,
        "comparison_https": 1348339491
      },
      {
        "timestamp": 1486558800,
        "http": 2921680076,
        "actualTime": 1483880400,
        "https": 1325006149,
        "comparison_http": 3189459173,
        "comparison_https": 1428895371
      },
      {
        "timestamp": 1486562400,
        "http": 2997236197,
        "actualTime": 1483884000,
        "https": 1438895589,
        "comparison_http": 3026125078,
        "comparison_https": 1380561903
      },
      {
        "timestamp": 1486566000,
        "http": 3236125873,
        "actualTime": 1483887600,
        "https": 1536118223,
        "comparison_http": 3266126128,
        "comparison_https": 1498340199
      },
      {
        "timestamp": 1486569600,
        "http": 3732794881,
        "actualTime": 1483891200,
        "https": 1781119313,
        "comparison_http": 3771684103,
        "comparison_https": 1716674579
      },
      {
        "timestamp": 1486573200,
        "http": 3970573852,
        "actualTime": 1483894800,
        "https": 1885564256,
        "comparison_http": 3990018305,
        "comparison_https": 1857230804
      },
      {
        "timestamp": 1486576800,
        "http": 3937795765,
        "actualTime": 1483898400,
        "https": 1872230799,
        "comparison_http": 4025574088,
        "comparison_https": 1823897260
      },
      {
        "timestamp": 1486580400,
        "http": 4030574248,
        "actualTime": 1483902000,
        "https": 1927786625,
        "comparison_http": 4083352111,
        "comparison_https": 1911119970
      },
      {
        "timestamp": 1486584000,
        "http": 4205575066,
        "actualTime": 1483905600,
        "https": 1906675446,
        "comparison_http": 4212797333,
        "comparison_https": 1935009047
      },
      {
        "timestamp": 1486587600,
        "http": 4196685946,
        "actualTime": 1483909200,
        "https": 1948897833,
        "comparison_http": 4196130497,
        "comparison_https": 1940008957
      },
      {
        "timestamp": 1486591200,
        "http": 4148352317,
        "actualTime": 1483912800,
        "https": 1978342442,
        "comparison_http": 4238352893,
        "comparison_https": 1945009004
      },
      {
        "timestamp": 1486594800,
        "http": 4043907711,
        "actualTime": 1483916400,
        "https": 1880564229,
        "comparison_http": 4035574397,
        "comparison_https": 1915008909
      },
      {
        "timestamp": 1486598400,
        "http": 3846684322,
        "actualTime": 1483920000,
        "https": 1807786131,
        "comparison_http": 3588905308,
        "comparison_https": 1676118848
      },
      {
        "timestamp": 1486602000,
        "http": 3564460829,
        "actualTime": 1483923600,
        "https": 1693896619,
        "comparison_http": 3333348676,
        "comparison_https": 1607229679
      },
      {
        "timestamp": 1486605600,
        "http": 3385015547,
        "actualTime": 1483927200,
        "https": 1547229424,
        "comparison_http": 2963902497,
        "comparison_https": 1435006554
      },
      {
        "timestamp": 1486609200,
        "http": 3101680839,
        "actualTime": 1483930800,
        "https": 1454451241,
        "comparison_http": 2708345706,
        "comparison_https": 1280561444
      },
      {
        "timestamp": 1486612800,
        "http": 2910013415,
        "actualTime": 1483934400,
        "https": 1401673119,
        "comparison_http": 2596123009,
        "comparison_https": 1187227653
      },
      {
        "timestamp": 1486616400,
        "http": 2721123721,
        "actualTime": 1483938000,
        "https": 1236672353,
        "comparison_http": 2356121946,
        "comparison_https": 1095005045
      },
      {
        "timestamp": 1486620000,
        "http": 2087787467,
        "actualTime": 1483941600,
        "https": 983893392,
        "comparison_http": 2030564834,
        "comparison_https": 936671025
      },
      {
        "timestamp": 1486623600,
        "http": 1968342365,
        "actualTime": 1483945200,
        "https": 899448555,
        "comparison_http": 1807786042,
        "comparison_https": 899448565
      },
      {
        "timestamp": 1486627200,
        "http": 2192787883,
        "actualTime": 1483948800,
        "https": 991115670,
        "comparison_http": 1966675734,
        "comparison_https": 905004107
      },
      {
        "timestamp": 1486630800,
        "http": 2201676772,
        "actualTime": 1483952400,
        "https": 1046116012,
        "comparison_http": 1913897817,
        "comparison_https": 951115497
      },
      {
        "timestamp": 1486634400,
        "http": 2067787326,
        "actualTime": 1483956000,
        "https": 957226536,
        "comparison_http": 2192787858,
        "comparison_https": 1056671498
      },
      {
        "timestamp": 1486638000,
        "http": 2226121389,
        "actualTime": 1483959600,
        "https": 1022226904,
        "comparison_http": 2330010803,
        "comparison_https": 1092782809
      },
      {
        "timestamp": 1486641600,
        "http": 2267788211,
        "actualTime": 1483963200,
        "https": 1057782672,
        "comparison_http": 2051120514,
        "comparison_https": 936115442
      },
      {
        "timestamp": 1486645200,
        "http": 2474455842,
        "actualTime": 1483966800,
        "https": 1176672035,
        "comparison_http": 2296121573,
        "comparison_https": 1067782672
      },
      {
        "timestamp": 1486648800,
        "http": 3067792009,
        "actualTime": 1483970400,
        "https": 1461673472,
        "comparison_http": 2689456682,
        "comparison_https": 1240561250
      },
      {
        "timestamp": 1486652400,
        "http": 3366126520,
        "actualTime": 1483974000,
        "https": 1531673772,
        "comparison_http": 2890013412,
        "comparison_https": 1373339650
      },
      {
        "timestamp": 1486656000,
        "http": 3495015980,
        "actualTime": 1483977600,
        "https": 1615563009,
        "comparison_http": 3073347556,
        "comparison_https": 1502784748
      },
      {
        "timestamp": 1486659600,
        "http": 3678350277,
        "actualTime": 1483981200,
        "https": 1767230375,
        "comparison_http": 3306681829,
        "comparison_https": 1586118467
      },
      {
        "timestamp": 1486663200,
        "http": 4062796416,
        "actualTime": 1483984800,
        "https": 1841675149,
        "comparison_http": 3970573890,
        "comparison_https": 1901119842
      },
      {
        "timestamp": 1486666800,
        "http": 4117241178,
        "actualTime": 1483988400,
        "https": 1952231330,
        "comparison_http": 4113907830,
        "comparison_https": 1921675562
      },
      {
        "timestamp": 1486670400,
        "http": 4300575492,
        "actualTime": 1483992000,
        "https": 2036120487,
        "comparison_http": 3837239908,
        "comparison_https": 1886675378
      },
      {
        "timestamp": 1486674000,
        "http": 4293353131,
        "actualTime": 1483995600,
        "https": 2013898254,
        "comparison_http": 3920573638,
        "comparison_https": 1837230662
      },
      {
        "timestamp": 1486677600,
        "http": 4124463309,
        "actualTime": 1483999200,
        "https": 1952231201,
        "comparison_http": 3732794940,
        "comparison_https": 1776119204
      },
      {
        "timestamp": 1486681200,
        "http": 3939462700,
        "actualTime": 1484002800,
        "https": 1842230597,
        "comparison_http": 3616127919,
        "comparison_https": 1684452125
      },
      {
        "timestamp": 1486684800,
        "http": 3720017179,
        "actualTime": 1484006400,
        "https": 1778897191,
        "comparison_http": 3756683846,
        "comparison_https": 1750563606
      },
      {
        "timestamp": 1486688400,
        "http": 3528905112,
        "actualTime": 1484010000,
        "https": 1648340863,
        "comparison_http": 3530016332,
        "comparison_https": 1632785313
      },
      {
        "timestamp": 1486692000,
        "http": 3188348138,
        "actualTime": 1484013600,
        "https": 1445562268,
        "comparison_http": 3092791876,
        "comparison_https": 1487229130
      },
      {
        "timestamp": 1486695600,
        "http": 2866124297,
        "actualTime": 1484017200,
        "https": 1365561956,
        "comparison_http": 2870013220,
        "comparison_https": 1335006082
      },
      {
        "timestamp": 1486699200,
        "http": 2998347188,
        "actualTime": 1484020800,
        "https": 1424450986,
        "comparison_http": 3011125041,
        "comparison_https": 1420006644
      },
      {
        "timestamp": 1486702800,
        "http": 2840568629,
        "actualTime": 1484024400,
        "https": 1273894818,
        "comparison_http": 2766679451,
        "comparison_https": 1301117001
      },
      {
        "timestamp": 1486706400,
        "http": 2181121207,
        "actualTime": 1484028000,
        "https": 1025004694,
        "comparison_http": 2582789707,
        "comparison_https": 1239450132
      },
      {
        "timestamp": 1486710000,
        "http": 1986675988,
        "actualTime": 1484031600,
        "https": 972226716,
        "comparison_http": 2477233745,
        "comparison_https": 1145560875
      },
      {
        "timestamp": 1486713600,
        "http": 1777785972,
        "actualTime": 1484035200,
        "https": 800559267,
        "comparison_http": 2260010422,
        "comparison_https": 1051671521
      },
      {
        "timestamp": 1486717200,
        "http": 1731674596,
        "actualTime": 1484038800,
        "https": 854448402,
        "comparison_http": 2220010169,
        "comparison_https": 1071671695
      },
      {
        "timestamp": 1486720800,
        "http": 2585567492,
        "actualTime": 1484042400,
        "https": 1178338756,
        "comparison_http": 1970564649,
        "comparison_https": 903893056
      },
      {
        "timestamp": 1486724400,
        "http": 2705568093,
        "actualTime": 1484046000,
        "https": 1235005706,
        "comparison_http": 2156121187,
        "comparison_https": 965560000
      },
      {
        "timestamp": 1486728000,
        "http": 2778346217,
        "actualTime": 1484049600,
        "https": 1269450290,
        "comparison_http": 2171121038,
        "comparison_https": 976115553
      },
      {
        "timestamp": 1486731600,
        "http": 2993902833,
        "actualTime": 1484053200,
        "https": 1389450932,
        "comparison_http": 2403344375,
        "comparison_https": 1086116135
      },
      {
        "timestamp": 1486735200,
        "http": 2957791380,
        "actualTime": 1484056800,
        "https": 1414450947,
        "comparison_http": 2796679673,
        "comparison_https": 1333339543
      },
      {
        "timestamp": 1486738800,
        "http": 3207237081,
        "actualTime": 1484060400,
        "https": 1493895914,
        "comparison_http": 3124458781,
        "comparison_https": 1408339763
      },
      {
        "timestamp": 1486742400,
        "http": 3643905801,
        "actualTime": 1484064000,
        "https": 1660563173,
        "comparison_http": 3565016378,
        "comparison_https": 1676674362
      }
    ]

    const stackAreaChartWithComparisonAreas = [
      {
        "dataKey": "comparison_http",
        "name": "Comparison HTTP",
        "className": "comparison_http",
        "stackId": 2
      },
      {
        "dataKey": "comparison_https",
        "name": "Comparison HTTPS",
        "className": "comparison_https",
        "stackId": 2
      },
      {
        "dataKey": "http",
        "name": "HTTP",
        "className": "http",
        "stackId": 1
      },
      {
        "dataKey": "https",
        "name": "HTTPS",
        "className": "https",
        "stackId": 1
      }
    ]

    const areaColors = {
      http: {
        background: paleblue
      },
      https: {
        background: tealgreen
      },
      comparison_http: {
        stroke: purple,
        background: darkblue
      },
      comparison_https: {
        stroke: yellow,
        background: black20
      }
    }
    const AreaChartArea = [
      {
        "dataKey": "http",
        "name": "HTTP",
        "className": "http",
        "stackId": 1
      }
    ]

    const stackAreaChartAreas = [
      {
        "dataKey": "http",
        "name": "HTTP",
        "className": "http",
        "stackId": 1
      },
      {
        "dataKey": "https",
        "name": "HTTPS",
        "className": "https",
        "stackId": 1
      }
    ]

    const ComparisonAreaChartAreas = [
      {
        "dataKey": "comparison_http",
        "name": "Comparison HTTP",
        "className": "comparison_http",
        "stackId": 2
      },
      {
        "dataKey": "http",
        "name": "HTTP",
        "className": "http",
        "stackId": 1
      }
    ]

    const lineChartData = [
      {
        "bytes": 204500916350,
        "timestamp": 1486954800,
        "requests": 818,
        "bits_per_second": 454446481
      },
      {
        "bytes": 181250833509,
        "timestamp": 1486958400,
        "requests": 725,
        "bits_per_second": 402779630
      },
      {
        "bytes": 173250805647,
        "timestamp": 1486962000,
        "requests": 693,
        "bits_per_second": 385001790
      },
      {
        "bytes": 144250679728,
        "timestamp": 1486965600,
        "requests": 577,
        "bits_per_second": 320557066
      },
      {
        "bytes": 139750643144,
        "timestamp": 1486969200,
        "requests": 559,
        "bits_per_second": 310556985
      },
      {
        "bytes": 129000601232,
        "timestamp": 1486972800,
        "requests": 516,
        "bits_per_second": 286668003
      },
      {
        "bytes": 124500568420,
        "timestamp": 1486976400,
        "requests": 498,
        "bits_per_second": 276667930
      },
      {
        "bytes": 167000748620,
        "timestamp": 1486980000,
        "requests": 668,
        "bits_per_second": 371112775
      },
      {
        "bytes": 163750751723,
        "timestamp": 1486983600,
        "requests": 655,
        "bits_per_second": 363890559
      },
      {
        "bytes": 161000755588,
        "timestamp": 1486987200,
        "requests": 644,
        "bits_per_second": 357779457
      },
      {
        "bytes": 194500897449,
        "timestamp": 1486990800,
        "requests": 778,
        "bits_per_second": 432224217
      },
      {
        "bytes": 206750961166,
        "timestamp": 1486994400,
        "requests": 827,
        "bits_per_second": 459446580
      },
      {
        "bytes": 222751006132,
        "timestamp": 1486998000,
        "requests": 891,
        "bits_per_second": 495002236
      },
      {
        "bytes": 218751021984,
        "timestamp": 1487001600,
        "requests": 875,
        "bits_per_second": 486113382
      },
      {
        "bytes": 249751140640,
        "timestamp": 1487005200,
        "requests": 999,
        "bits_per_second": 555002535
      },
      {
        "bytes": 279251258139,
        "timestamp": 1487008800,
        "requests": 1117,
        "bits_per_second": 620558351
      },
      {
        "bytes": 291751375427,
        "timestamp": 1487012400,
        "requests": 1167,
        "bits_per_second": 648336390
      },
      {
        "bytes": 270001234276,
        "timestamp": 1487016000,
        "requests": 1080,
        "bits_per_second": 600002743
      },
      {
        "bytes": 296001378284,
        "timestamp": 1487019600,
        "requests": 1184,
        "bits_per_second": 657780841
      },
      {
        "bytes": 295251348827,
        "timestamp": 1487023200,
        "requests": 1181,
        "bits_per_second": 656114109
      },
      {
        "bytes": 279251290899,
        "timestamp": 1487026800,
        "requests": 1117,
        "bits_per_second": 620558424
      }
    ]

    const singleBarChartData = [
      {
        "name": "AsiaNet",
        "onNetHttp": 58034767339905
      },
      {
        "name": "QXT",
        "onNetHttp": 17640581263893
      },
      {
        "name": "Datafone Inc.",
        "onNetHttp": 9149792187422
      },
      {
        "name": "Datafone Inc.",
        "onNetHttp": 9149792187422
      },
      {
        "name": "QXT",
        "onNetHttp": 17640581263893
      },
      {
        "name": "AsiaNet",
        "onNetHttp": 58034767339905
      },
      {
        "name": "QXT",
        "onNetHttp": 17640581263893
      },
      {
        "name": "AsiaNet",
        "onNetHttp": 58034767339905
      }
    ]

    const datasetA = spDashboardData.traffic.detail.map(datapoint => {
      return {
        bytes: datapoint.bytes_net_on || 0,
        timestamp: datapoint.timestamp
      }
    })

    const datasetB = spDashboardData.traffic.detail.map(datapoint => {
      return {
        bytes: datapoint.bytes_net_off || 0,
        timestamp: datapoint.timestamp
      }
    })

    const countryData = Immutable.fromJS([
      {
        "name": "Hong Kong",
        "bits_per_second": 2801215741,
        "code": "HKG",
        "total": 484049729862220
      },
      {
        "name": "Japan",
        "bits_per_second": 1011356667,
        "code": "JPN",
        "total": 174762305623425
      },
      {
        "name": "Korea, Republic Of",
        "bits_per_second": 500033048,
        "code": "KOR",
        "total": 86405648211184
      },
      {
        "name": "Malaysia",
        "bits_per_second": 472250782,
        "code": "MYS",
        "total": 81604876012993
      }
    ])

    const cityData = Immutable.fromJS([
      {
        "name": "daejeon",
        "percent_change": 0.5567,
        "percent_total": 0.0864,
        "historical_total": 1404256487825,
        "total": 2186010027527,
        "requests": 8744,
        "country": "KOR",
        "region": "30",
        "lat": 36.3261,
        "lon": 127.4299,
        "bits_per_second": 8800367,
        "average_bits_per_second": 8800362,
        "average_bytes": 3960163093
      }
    ])

    let totalDatasetValueOutput = separateUnit(formatBytes(spDashboardData.traffic.bytes))
    let totalDatasetValue = totalDatasetValueOutput.value
    let totalDatasetUnit = totalDatasetValueOutput.unit

    let datasetAValue = numeral((spDashboardData.traffic.bytes_net_on / spDashboardData.traffic.bytes) * 100).format('0,0')
    let datasetBValue = numeral((spDashboardData.traffic.bytes_net_off / spDashboardData.traffic.bytes) * 100).format('0,0')

    return (
      <div className="styleguide-page">

        <div className="container">

          <h1 className="page-header">Ericsson UDN Styleguide</h1>

          <h1 className="page-header">Typography</h1>

          <h1>Heading H1</h1>
          <h2>Heading H2</h2>
          <h3>Heading H3</h3>
          <h4>Heading H4</h4>
          <h5>Heading H5</h5>

          <h3>Heading with label <Label>New</Label></h3>

          <hr />

          <p className="lead">Leading body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

          <hr />

          <p>Body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin accumsan in nisi at suscipit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec et sem posuere, pulvinar purus quis, varius augue. Praesent porttitor, mauris aliquet feugiat vestibulum, diam augue tempor turpis, id facilisis sapien massa ac eros. Vestibulum pretium cursus varius. Suspendisse sed enim vel orci fermentum consectetur. Cras metus risus, ultrices ut elit id, fringilla euismod quam. In pharetra tellus lectus. Aliquam erat volutpat. Morbi justo neque, pellentesque quis nunc a, varius euismod odio. Integer gravida quam sit amet ornare mattis. Proin molestie ex vitae ligula pellentesque, vitae placerat magna tincidunt. Aliquam sed purus id lectus volutpat suscipit quis a mauris. Fusce in est mattis, tristique mi id, auctor nibh. Proin venenatis id sapien id lobortis. Nullam cursus nisi mauris, eget interdum nisi porttitor nec.</p>

          <p className="text-sm">Small body text.</p>

          <h1 className="page-header">Breadcrumbs</h1>

          <Breadcrumb>
            <BreadcrumbItem href="#">
              Home
            </BreadcrumbItem>
            <BreadcrumbItem href="#">
              Configuration
            </BreadcrumbItem>
            <BreadcrumbItem active={true}>
              Account
            </BreadcrumbItem>
          </Breadcrumb>


          <h1 className="page-header">Charts</h1>
          <Row>
            <label>Stacked barchart</label>
            <SectionContainer className="analysis-chart-container">
              {<BarChart
                chartLabel="Month to Date"
                chartData={stackedBarChartData}
                barModels={[
                  { dataKey: 'offNetHttps', name: 'Off-Net HTTPS', className: 'line-3' },
                  { dataKey: 'offNetHttp', name: 'Off-Net HTTP', className: 'line-2' },
                  { dataKey: 'onNetHttps', name: 'On-Net HTTPS', className: 'line-1' },
                  { dataKey: 'onNetHttp', name: 'On-Net HTTP', className: 'line-0' }
                ]}/>}
            </SectionContainer>
            </Row>

            <hr />

            <Row>
              <label>Normal barchart</label>
              <SectionContainer className="analysis-chart-container">
                <BarChart
                  chartLabel="This Week"
                  chartData={singleBarChartData}
                  barModels={[{ dataKey: 'onNetHttp', name: 'On-Net HTTP', className: 'line-0' }]}/>
              </SectionContainer>
            </Row>

            <hr/>

            <Row>
              <label>Line chart</label>
              <SectionContainer className="analysis-by-time">
                <LineChart
                  data={lineChartData}
                  dataKey="bits_per_second"
                />
              </SectionContainer>
            </Row>

            <hr/>

            <Row>
              <label>Area chart</label>
              <SectionContainer className="analysis-by-time">
                <StackedAreaChart
                  chartLabel="Oct 2016 Month To Date"
                  areas={AreaChartArea}
                  data={stackAreaChartWithComparisonData}
                  valueFormatter={formatBitsPerSecond}
                  areaColors={areaColors}
                />
              </SectionContainer>
            </Row>

            <hr/>

            <Row>
              <label>Stacked area chart</label>
              <SectionContainer className="analysis-by-time">
                <StackedAreaChart
                  chartLabel="Oct 2016 Month To Date"
                  areas={stackAreaChartAreas}
                  data={stackAreaChartWithComparisonData}
                  valueFormatter={formatBitsPerSecond}
                  areaColors={areaColors}
                />
              </SectionContainer>
            </Row>

            <hr/>
            <Row>
              <label>Comparison area chart</label>
              <SectionContainer className="analysis-by-time">
                <StackedAreaChart
                  chartLabel="Oct 2016 Month To Date"
                  areas={ComparisonAreaChartAreas}
                  data={stackAreaChartWithComparisonData}
                  valueFormatter={formatBitsPerSecond}
                  areaColors={areaColors}
                />
              </SectionContainer>
            </Row>

            <hr/>
            <Row>
              <label>Comparison chart for two stacked area</label>
              <SectionContainer className="analysis-by-time">
                <StackedAreaChart
                  chartLabel="Oct 2016 Month To Date"
                  areas={stackAreaChartWithComparisonAreas}
                  data={stackAreaChartWithComparisonData}
                  valueFormatter={formatBitsPerSecond}
                  areaColors={areaColors}
                />
              </SectionContainer>
            </Row>
          <h1 className="page-header">Tabs</h1>

          <Tabs
            activeKey={this.state.activeTab}
            className="styleguide-row"
            onSelect={key => this.setState({ activeTab: key })}>
            <NavItem eventKey={1}>Tab Name 1</NavItem>
            <NavItem eventKey={2}>Long Tab Name 2</NavItem>
            <NavItem eventKey={3}>Longer Tab Name 3</NavItem>
            <NavItem eventKey={4}>Even Longer Tab Name 4</NavItem>
            <NavItem eventKey={5}>Can&apos;t believe how Long Tab Name 5</NavItem>
            <NavItem eventKey={6}>Normal Tab Name 6</NavItem>
          </Tabs>

          {this.state.activeTab === 1 &&
            <div>Tab 1 content</div>
          }
          {this.state.activeTab === 2 &&
            <div>Tab 2 content</div>
          }
          {this.state.activeTab === 3 &&
            <div>Tab 3 content</div>
          }
          {this.state.activeTab === 4 &&
            <div>Tab 4 content</div>
          }
          {this.state.activeTab === 5 &&
            <div>Tab 5 content</div>
          }
          {this.state.activeTab === 6 &&
            <div>Tab 6 content</div>
          }


          <hr />


          <h1 className="page-header">Buttons</h1>
          <ButtonToolbar className="styleguide-row">
            <Button bsStyle="primary">Primary</Button>
            <Button className="btn-secondary">Secondary</Button>
            <Button className="btn-tertiary">Tertiary</Button>
            <Button bsStyle="danger">Destructive</Button>
            <Button bsStyle="success">Confirmation</Button>
            <Button bsStyle="link">Link button</Button>
            <Button bsStyle="success" className="btn-icon"><IconAdd/></Button>
            <Button bsStyle="primary" className="btn-icon btn-round"><IconQuestionMark/></Button>
          </ButtonToolbar>

          <ButtonToolbar className="styleguide-row">
            <Button bsStyle="primary" disabled={true}>Primary</Button>
            <Button className="btn-secondary" disabled={true}>Secondary</Button>
            <Button className="btn-tertiary" disabled={true}>Tertiary</Button>
            <Button bsStyle="danger" disabled={true}>Destructive</Button>
            <Button bsStyle="success" disabled={true}>Confirmation</Button>
            <Button bsStyle="link" disabled={true}>Link button</Button>
            <Button bsStyle="success" className="btn-icon" disabled={true}><IconAdd/></Button>
            <Button bsStyle="primary" className="btn-icon btn-round" disabled={true}><IconQuestionMark/></Button>
          </ButtonToolbar>


          <h1 className="page-header">Dropdowns</h1>
          <div className="row">
            <div className="col-xs-3">
              <SelectWrapper options={[[1, 'Item 1'], [2, 'Item 2'], [3, 'Dropdown Item 3']]} value={1}/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-6">
              <FilterChecklistDropdown
                options={filterCheckboxOptions}
                value={this.state.filterCheckboxValue}
                onChange={(newVals)=>this.setState({filterCheckboxValue: newVals})} />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6">
              <SelectorComponent items={[[1, 'Item 1'], [2, 'Item 2'], [3, 'Dropdown Item 3']]} drillable={true}>
                <div className="btn btn-link dropdown-toggle header-toggle">
                  <h1>Select Account</h1>
                  <IconCaretDown />
                </div>
              </SelectorComponent>
            </div>
          </div>

          <h1 className="page-header">Tables</h1>
          <Table striped={true}>
            <thead>
              <tr>
                <th>Rule Priority</th>
                <th>Rule Type</th>
                <th>Rule</th>
                <th>TTL Value</th>
                <th>Match Condition</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>extension</td>
                <td>gif</td>
                <td>1 day</td>
                <td>positive</td>
              </tr>
              <tr>
                <td>2</td>
                <td>directory</td>
                <td>/wp-content</td>
                <td>no-store</td>
                <td>positive</td>
              </tr>
              <tr>
                <td>3</td>
                <td>MIME-type</td>
                <td>video/mpeg</td>
                <td>15 min</td>
                <td>positive</td>
              </tr>
              <tr>
                <td>4</td>
                <td>extension</td>
                <td>txt</td>
                <td>1 hour</td>
                <td>negative</td>
              </tr>
              <tr>
                <td>5</td>
                <td>directory</td>
                <td>/wp-admin</td>
                <td>no-store</td>
                <td>positive</td>
              </tr>
              <tr>
                <td>6</td>
                <td>MIME-type</td>
                <td>text/html</td>
                <td>1 week</td>
                <td>negative</td>
              </tr>
            </tbody>
          </Table>

          <h1 className="page-header">Forms</h1>

          <div className="row">
            <div className="col-xs-6">
              <FormGroup>
                <ControlLabel>Default Input</ControlLabel>
                <FormControl type="text" placeholder="Enter text" />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Email Input</ControlLabel>
                <FormControl type="email" placeholder="Enter email" />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Password Input</ControlLabel>
                <FormControl type="password" placeholder="Enter password" />
              </FormGroup>

              <FormGroup>
                <ControlLabel>Input with Addons</ControlLabel>
                <InputGroup>
                  <InputGroup.Addon>{"$"}</InputGroup.Addon>
                  <FormControl type="text" placeholder="Enter text" />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Text Area</ControlLabel>
                <FormControl componentClass="textArea" placeholder="Enter text" />
              </FormGroup>
            </div>

            <div className="col-xs-6">
              <FormGroup validationState="success">
                <ControlLabel>Has Success</ControlLabel>
                <FormControl type="text" />
                <HelpBlock>Helper text</HelpBlock>
              </FormGroup>

              <FormGroup validationState="error">
                <ControlLabel>Has Error</ControlLabel>
                <FormControl type="text" />
                <HelpBlock>Helper text</HelpBlock>
              </FormGroup>
            </div>
          </div>

          <hr />

          <div className="row">

            <div className="col-xs-6">

              <form className="form-horizontal">

                <FormGroup>
                  <Col componentClass={ControlLabel} xs={3}>
                    Inline Input
                  </Col>
                  <Col xs={9}>
                    <InputGroup>
                      <FormControl />
                      <InputGroup.Addon>
                        <OverlayTrigger trigger="click" rootClose={true} overlay={
                          <Popover id="popover1" title="Info">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          </Popover>
                        }>
                        <Button bsStyle="link" className="col-xs-2"><IconQuestionMark /></Button>
                        </OverlayTrigger>
                      </InputGroup.Addon>
                    </InputGroup>
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col componentClass={ControlLabel} xs={3}>
                    Inline Text Area
                  </Col>
                  <Col xs={9}>
                    <FormControl componentClass="textarea" />
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Checkbox inline={true}>Inline Checkbox</Checkbox>
                </FormGroup>

              </form>

            </div>

          </div>


          <hr />

          <Row>

            <Col xs={6}>

              <ControlLabel>Number Input</ControlLabel>
              <p>Example min = 0, max = 200</p>

              <FormGroup>
                <NumberInput
                  max={200}
                  min={0}
                  onChange={val => this.setState({
                    numberInputValue: val === parseInt(val, 10) || !val ?
                      val :
                      val.target.value
                  })}
                  value={this.state.numberInputValue} />
              </FormGroup>

            </Col>

          </Row>


          <hr />

          <div className="row">

            <div className="col-xs-6">

              <FormGroup>
                <ControlLabel>Checkboxes</ControlLabel>
                <Checkbox value={1}>Checkbox 1</Checkbox>
                <Checkbox value={2}>Checkbox 2</Checkbox>
                <Checkbox value={3}>Checkbox 3</Checkbox>
                <Checkbox value={4} disabled={true}>Checkbox Disabled</Checkbox>
              </FormGroup>

            </div>

            <div className="col-xs-6">

              <FormGroup controlId="Radio">
                <ControlLabel>Radios</ControlLabel>
                <Radio value={1}>Radio 1</Radio>
                <Radio value={2}>Radio 2</Radio>
                <Radio value={3}>Radio 3</Radio>
                <Radio value={4} disabled={true}>Radio Disabled</Radio>
              </FormGroup>

            </div>

          </div>


          <hr />

          <label>Select</label>
          <div>
            <Dropdown id="dropdown-select" className="dropdown-select">
              <Dropdown.Toggle>
                View Production
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <MenuItem eventKey="1" active={true}>Production</MenuItem>
                <MenuItem eventKey="2">Staging</MenuItem>
                <MenuItem eventKey="3">In Process</MenuItem>
                <MenuItem eventKey="4">History</MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <h1 className="page-header">Multi Option Selector</h1>

          <MultiOptionSelector
            options={[
              {
                label: 'Service 1',
                options: [
                  {label: 'Option 1-1', value: 1},
                  {label: 'Option 1-2', value: 2},
                  {label: 'Option 1-3', value: 3}
                ],
                value: 1
              },
              {
                label: 'Service 2',
                options: [
                  {label: 'Option 2-1', value: 1},
                  {label: 'Option 2-2', value: 2},
                  {label: 'Option 2-3', value: 3}
                ],
                value: 2
              }
            ]}
            field={{
              onChange: val => this.setState({ multiOptionValues: Immutable.List(val) }),
              value: this.state.multiOptionValues
            }}
            />

          <h1 className="page-header">Token input</h1>

          <Row>
            <Col xs={6}>
              <label>Predefined list</label>
              <Typeahead
                multiple={true}
                onChange={() => null}
                options={[
                  {id: 'BY', label: 'Belarus'},
                  {id: 'CA', label: 'Canada'},
                  {id: 'FI', label: 'Finland'},
                  {id: 'DE', label: 'Germany'},
                  {id: 'SE', label: 'Sweden'},
                  {id: 'UA', label: 'Ukraine'},
                  {id: 'US', label: 'United States'}
                ]}/>
            </Col>

            <Col xs={6}>
              <label>Allows custom token creation</label>
              <Typeahead
                emptyLabel="Add tokens by typing"
                newSelectionPrefix="Add token: "
                allowNew={true}
                multiple={true}
                onChange={() => null}
                options={[]}/>
            </Col>
          </Row>

          <h1 className="page-header">Month Picker</h1>
          <Row>
            <Col xs={6}>
              <MonthPicker
                date={null}
                onChange={() => null} />
            </Col>
          </Row>

          <h1 className="page-header">Stacked By Time Summary</h1>
          <Row>
            <Col xs={6}>
              <StackedByTimeSummary
                dataKey="bytes"
                totalDatasetValue={totalDatasetValue}
                totalDatasetUnit={totalDatasetUnit}
                datasetAArray={datasetA}
                datasetALabel="On-Net"
                datasetAUnit="%"
                datasetAValue={datasetAValue}
                datasetBArray={datasetB}
                datasetBLabel="Off-Net"
                datasetBUnit="%"
                datasetBValue={datasetBValue}
              />
            </Col>
          </Row>

          <h1 className="page-header">Mini Chart</h1>
          <Row>
            <Col xs={3}>
              <label>With label and KPI</label>
              <hr />
              <MiniChart
                dataKey="bytes"
                data={[
                  {bytes: 15000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
                  {bytes: 150000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
                  {bytes: 140000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
                  {bytes: 190000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
                  {bytes: 180000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')}
                ]}
                kpiValue={80}
                kpiUnit="Gbps"
                label="Avg Bandwidth" />
            </Col>
            <Col xs={3}>
              <label>With only KPI</label>
              <hr />
              <MiniChart
                dataKey="bytes"
                data={[
                  {bytes: 15000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
                  {bytes: 150000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
                  {bytes: 140000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
                  {bytes: 190000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
                  {bytes: 180000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')}
                ]}
                kpiValue="47.56"
                kpiUnit="%" />
            </Col>
            <Col xs={3}>
              <label>Right aligned KPI</label>
              <hr />
              <MiniChart
                dataKey="bytes"
                data={[
                  {bytes: 15000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
                  {bytes: 150000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
                  {bytes: 140000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
                  {bytes: 190000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
                  {bytes: 180000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')}
                ]}
                kpiValue={80}
                kpiUnit="Gbps"
                kpiRight={true} />
            </Col>
            <Col xs={3}>
              <label>Without label and KPI</label>
              <hr />
              <MiniChart
                dataKey="bytes"
                data={[
                  {bytes: 15000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
                  {bytes: 150000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
                  {bytes: 140000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
                  {bytes: 190000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
                  {bytes: 180000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
                  {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')}
                ]} />
            </Col>
          </Row>

          <h1 className="page-header">Date Picker</h1>

          <Row>
            <Col xs={4}>
              <DateRangeSelect
                endDate={this.state.datePickerEndDate}
                startDate={this.state.datePickerStartDate}
                limitRange={this.state.datePickerLimit}
                changeDateRange={(start, end) => this.setState({ datePickerEndDate: end, datePickerStartDate: start })}
                availableRanges={[
                  DateRanges.MONTH_TO_DATE,
                  DateRanges.LAST_MONTH,
                  DateRanges.THIS_WEEK,
                  DateRanges.LAST_WEEK
                ]} />
            </Col>
            <Col xs={4}>
              <Checkbox
                checked={this.state.datePickerLimit}
                onClick={
                  () => {
                    const { datePickerEndDate, datePickerStartDate, datePickerLimit } = this.state
                    if (!datePickerLimit && datePickerEndDate.diff(datePickerStartDate, 'months') >= 4) {
                      this.setState({
                        datePickerEndDate: this.state.datePickerStartDate.clone().add(4, 'months').subtract(1, 'day')
                      })
                    }
                    this.setState({ datePickerLimit: !datePickerLimit })
                  }
                }>Limit range to 4 months</Checkbox>
            </Col>
            <Col xs={4}>
              <p>{`startDate: ${this.state.datePickerStartDate} (${this.state.datePickerStartDate.format('MM/DD/YYYY HH:mm')})`}</p>
              <p>{`endDate: ${this.state.datePickerEndDate} (${this.state.datePickerEndDate.format('MM/DD/YYYY HH:mm')})`}</p>
            </Col>
          </Row>

          <h1 className="page-header">Custom Date Picker</h1>

          <Row>
            <Col xs={4}>
              <CustomDatePicker
                startDate={this.state.customDatePickerStartDate}
                changeDateRange={(startDate, endDate) => this.setState({ customDatePickerEndDate: endDate, customDatePickerStartDate: startDate })} />
            </Col>
            <Col xs={4}>
              <p>{`startDate: ${this.state.customDatePickerStartDate} (${this.state.customDatePickerStartDate.format('MM/DD/YYYY HH:mm')})`}</p>
            </Col>
            <Col xs={4}>
              <p>{`endDate: ${this.state.customDatePickerEndDate} (${this.state.customDatePickerEndDate.format('MM/DD/YYYY HH:mm')})`}</p>
            </Col>
          </Row>

          <h1 className="page-header">Side Panel</h1>
          <Button bsStyle="primary" onClick={() => this.setState({showSidePanel: true})}>Trigger Side Panel</Button>
          {this.state.showSidePanel &&
            <SidePanel
            show={this.state.showSidePanel}
            title="Side Panel"
            subTitle="Styleguide Example"
            cancelButton={true}
            submitButton={true}
            submitText="Close"
            cancel={() => this.setState({showSidePanel: false})}
            submit={() => this.setState({showSidePanel: false})}>
            <form onSubmit={() => this.setState({showSidePanel: false})}>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl/>
              </FormGroup>

              <hr/>

              <FormGroup>
                <ControlLabel>Type</ControlLabel>
                <FormControl/>
              </FormGroup>
            </form>
          </SidePanel>}

          <h1 className="page-header">Dashboard Panel</h1>

          <DashboardPanels>
            <DashboardPanel title="Traffic">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum et mi imperdiet, condimentum nibh a, tincidunt ipsum. Fusce vitae metus iaculis, iaculis nunc vel, laoreet nisi. Aliquam quis tortor vitae odio porttitor suscipit. Donec vel nisl quis lacus consequat semper. Morbi cursus vestibulum urna. Praesent eleifend feugiat enim, eget accumsan mauris aliquet et. Vivamus tincidunt magna est, id commodo felis tempor vitae. In odio nisl, mollis interdum lacus et, varius scelerisque odio. Curabitur vitae libero eu metus mattis vulputate. Quisque commodo congue fringilla.</p>
            </DashboardPanel>
            <DashboardPanel title="No padding" noPadding={true}>
              <Image responsive={true} src="https://upload.wikimedia.org/wikipedia/en/archive/a/a4/20060531003742!United_States_(World_Map).png" />
            </DashboardPanel>
          </DashboardPanels>

          <h1 className="page-header">Pagination</h1>
          <Pagination items={10} maxButtons={5} activePage={5} prev={true} next={true} first={true} last={true} ellipsis={true} />

          <h1 className="page-header">CsvUpload</h1>
          <CsvUploadArea
            contentValidation={() => {
              return true
            }}
            onDropCompleted={(validFiles, rejectedFiles) => {
              // eslint-disable-next-line no-console
              console.error(rejectedFiles)
            }}
            acceptFileTypes={["text/csv"]}
            uploadModalOnClick={true}/>

          <h1 className="page-header">Aspera Upload</h1>
          <AsperaUpload openUploadModalOnClick={true} />

          <h1 className="page-header">MapBox</h1>

          <Mapbox
            geoData={countriesGeoJSON}
            cityData={cityData}
            countryData={countryData}
            theme={this.props.theme}
            height={600}
            />

          <h1 className="page-header">Network</h1>

          <NetworkItem
            title="Network 1"
            content="Lorem ipsum dolor sit amet"
            status="enabled"
            onSelect={() => null}
            onEdit={() => null} />

          <h1 className="page-header">Storage</h1>

          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            <StorageItemChart
              analyticsLink='#'
              configurationLink='#'
              name="Storage 01"
              locations={["Hong Kong"]}
              currentUsage = {0}
              estimate = {100e12}
              peak = {0}
              lastMonthUsage = {0}
              lastMonthEstimate = {0}
              lastMonthPeak = {0} />

            <StorageItemChart
              analyticsLink='#'
              configurationLink='#'
              name="Storage 02"
              locations={["Hong Kong"]}
              currentUsage = {80.2e12}
              estimate = {250e12}
              peak = {160e12}
              lastMonthUsage = {100e12}
              lastMonthEstimate = {210e12}
              lastMonthPeak = {160e12} />

            <StorageItemChart
              analyticsLink='#'
              configurationLink='#'
              name="Storage very very very long name"
              locations={["Hong Kong", "Finland"]}
              currentUsage = {270e12}
              estimate = {300e12}
              peak = {380e12}
              lastMonthUsage = {240e12}
              lastMonthEstimate = {250e12}
              lastMonthPeak = {260e12} />

            <StorageItemChart
              analyticsLink='#'
              configurationLink='#'
              name="Storage 04"
              locations={["Hong Kong", "Finland", "United States"]}
              currentUsage = {520e12}
              estimate = {500e12}
              peak = {600e12}
              lastMonthUsage = {470e12}
              lastMonthEstimate = {450e12}
              lastMonthPeak = {480e12} />

            <StorageItemChart
              analyticsLink='#'
              configurationLink='#'
              name="Storage 05"
              locations={["Hong Kong", "Finland"]}
              currentUsage = {270e12}
              estimate = {300e12}
              peak = {380e12}
              lastMonthUsage = {240e12}
              lastMonthEstimate = {250e12}
              lastMonthPeak = {260e12} />

          </div>

          <h1 className="page-header">Storage KPI</h1>

          <StorageKPI
            chartData={[
              {bytes: 45000, timestamp: new Date('Thu May 26 2016 11:17:01 GMT-0700 (PDT)')},
              {bytes: 65000, timestamp: new Date('Thu May 26 2016 12:17:01 GMT-0700 (PDT)')},
              {bytes: 45000, timestamp: new Date('Thu May 26 2016 13:17:01 GMT-0700 (PDT)')},
              {bytes: 105000, timestamp: new Date('Thu May 26 2016 14:17:01 GMT-0700 (PDT)')},
              {bytes: 115000, timestamp: new Date('Thu May 26 2016 15:17:01 GMT-0700 (PDT)')},
              {bytes: 190000, timestamp: new Date('Thu May 26 2016 16:17:01 GMT-0700 (PDT)')},
              {bytes: 125000, timestamp: new Date('Thu May 26 2016 17:17:01 GMT-0700 (PDT)')},
              {bytes: 155000, timestamp: new Date('Thu May 26 2016 18:17:01 GMT-0700 (PDT)')}
            ]}
            chartDataKey='bytes'
            currentValue={112}
            gainPercentage={0.2}
            locations={['San Jose', 'Frankfurt']}
            peakValue={120}
            referenceValue={100}
            valuesUnit='tb'
          />

          <h1 className="page-header">Icons</h1>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconAccount />
            <br />
            IconAccount
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconAdd />
            <br />
            IconAdd
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconAlerts />
            <br />
            IconAlerts
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconAnalytics />
            <br />
            IconAnalytics
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowDown />
            <br />
            IconArrowDown
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowLeft />
            <br />
            IconArrowLeft
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowRight />
            <br />
            IconArrowRight
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowUp />
            <br />
            IconArrowUp
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconCaretRight />
            <br />
            IconCaretRight
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconCaretDown />
            <br />
            IconCaretDown
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowLgRight />
            <br />
            IconArrowLgRight
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowLgDown />
            <br />
            IconArrowLgDown
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconArrowLgUp />
            <br />
            IconArrowLgUp
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconChart />
            <br />
            IconChart
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconCheck />
            <br />
            IconCheck
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconChevronRight />
            <br />
            IconChevronRight
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconChevronRightBold />
            <br />
            IconChevronRightBold
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconClose />
            <br />
            IconClose
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconComments count="13" />
            <br />
            IconComments
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconConfiguration />
            <br />
            IconConfiguration
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconContent />
            <br />
            IconContent
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconDelete />
            <br />
            IconDelete
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconEdit />
            <br />
            IconEdit
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconEmail />
            <br />
            IconEmail
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconEricsson />
            <br />
            IconEricsson
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconExport />
            <br />
            IconExport
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconEye />
            <br />
            IconEye
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconHeaderCaret />
            <br />
            IconHeaderCaret
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconIncident />
            <br />
            IconIncident
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconInfo />
            <br />
            IconInfo
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconIntegration />
            <br />
            IconIntegration
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconItemChart />
            <br />
            IconItemChart
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconItemList />
            <br />
            IconItemList
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconPassword />
            <br />
            IconPassword
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconProblem />
            <br />
            IconProblem
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconQuestion />
            <br />
            IconQuestion
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconQuestionMark />
            <br />
            IconQuestionMark
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconSecurity />
            <br />
            IconSecurity
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconSelectCaret />
            <br />
            IconSelectCaret
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconServices />
            <br />
            IconServices
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconSupport />
            <br />
            IconSupport
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconTask />
            <br />
            IconTask
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconTrash />
            <br />
            IconTrash
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <LoadingSpinnerSmall />
            <br />
            LoadingSpinnerSmall
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconFile />
            <br />
            IconFile
          </span>
          <span className="col-xs-3" style={{marginBottom: '1em'}}>
            <IconFolder />
            <br />
            IconFolder
          </span>
        </div>

      </div>
    );
  }
}

Styleguide.displayName = 'Styleguide'
Styleguide.propTypes = {
  theme: React.PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    theme: state.ui.get('theme')
  }
}

export default connect(mapStateToProps)(Styleguide)
