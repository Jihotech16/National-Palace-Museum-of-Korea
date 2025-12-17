// 문제 데이터 설정
import sejongImage from '../image/세종.jpg'
import sealImage from '../image/태조추상시호금보.jpeg'
import ceilingImage from '../image/쌍용각보개.jpg'
import clothingImage from '../image/왕의면복.jpg'
import natureImage from '../image/일월오봉도 병풍.jpg'
import educationImage from '../image/보양청.jpg'
import ceremonialSealImage from '../image/어보2.jpg'
import recordImage from '../image/국조보감.jpg'
import politicsImage from '../image/의정부.png'
import examImage from '../image/이동춘 무과 홍패.jpg'
import ageImage from '../image/기상패인갱재록.jpg'
import dragonImage from '../image/청동용.jpg'
import queenSealImage from '../image/왕비금보.jpg'
import oryunImage from '../image/오륜행실도.jpg'
import suryeomImage from '../image/수렴청정.png'
import yeongchinImage from '../image/영친왕비 적의.jpg'
import hairpinImage from '../image/영친왕비 도금가란화잠.jpg'
import donguibogamImage from '../image/동의보감.jpg'
import deokonPrincessSealImage from '../image/덕온공주 인장.jpg'
import queenWonsamImage from '../image/영친왕비 별문숙고사 부금 홍원삼.jpg'
import queenChimaImage from '../image/영친왕비 화문갑사 부금 남대란치마.jpg'
import queenJokduriImage from '../image/궁중273_영친왕비 족두리.jpg'
import queenEmbroideryImage from '../image/궁중233_십장생문 자수 붓주머니(1).jpg'
import queenNorigaeImage from '../image/자수연화노리개.jpg'
import queenInmunboImage from '../image/창덕7975_봉황문인문보(1)_서헌강.jpg'
import empireImage from '../image/대한제국.png'
import independenceImage from '../image/독립신문.png'
import currencyImage from '../image/호조태환권.png'
import altarImage from '../image/환구단.png'
import palaceImage from '../image/경운궁.jpg'
import dondeokjeonImage from '../image/돈덕전.png'
import passportImage from '../image/대한제국 여권.png'
import hwajodoImage from '../image/화조도가리개.png'
import peonyImage from '../image/모란도병풍.png'
import sealBookImage from '../image/보소당인존.png'
import inkstoneImage from '../image/연잎모양큰벼루.png'
import fiveRitesImage from '../image/수교도.jpg'
import dongroeImage from '../image/동뢰연.png'
import daesaryeImage from '../image/대사례도.jpg'
import yeonImage from '../image/연.png'
import jeongchukgiImage from '../image/정축기.png'
import funeralImage from '../image/장례.jpg'
import jongmyoImage from '../image/종묘.gif'
import honcheoneuiImage from '../image/혼천의.png'
import calendarImage from '../image/기해대통력.png'
import ilseongjeongsiuiImage from '../image/일성정시의.jpg'
import soilyeongImage from '../image/소일영.png'
import cheonsangyeolchabunyajidoImage from '../image/천상열차분야지도.jpg'

export const QUESTION_DATA = {
  sealKing: {
    activityId: 'sealKing',
    questionNumber: '01',
    title: '조선의 국왕',
    description: '조선은 약 500년 동안 이어진 왕조로, 모두 17명의 국왕이 나라를 다스렸습니다. 이 가운데 조선의 4대 국왕은 누구일까요?',
    image: sejongImage,
    answerField: 'kingAnswer',
    answerPlaceholder: '국왕의 이름을 입력하세요',
    explanation: '세종대왕은 조선의 4대 국왕으로, 한글 창제와 과학 기술 발전 등 많은 업적을 남긴 위대한 군주입니다. 조선 왕조의 전성기를 이끈 왕으로 평가받고 있습니다.',
    customCss: null,
    inputType: 'single'
  },
  seal: {
    activityId: 'seal',
    questionNumber: '02',
    title: '태조 추상시호 금보',
    description: '태조 추상시호 금보는 태조(재위 1392~1398)에게 생전의 공덕을 기리는 칭호인 시호를 추가로 올리며 만든 금보입니다. 기존의 시호 \'강헌지인계운성문신무\'에 태조가 왕이 되기 이전의 업적인 위화도회군을 칭송하는 의미의 네 글자를 더하였는데 4글자는 무엇일까요?',
    image: sealImage,
    answerField: 'sealAnswer',
    answerPlaceholder: '답을 입력하세요',
    explanation: '태조 추상시호 금보에 추가된 \'정의광덕\' 네 글자는 태조가 왕이 되기 이전의 업적인 위화도회군을 칭송하는 의미입니다. 이는 태조의 공덕을 기리는 시호의 일부로 사용되었습니다.',
    customCss: 'Question02_Seal.css',
    inputType: 'single'
  },
  ceiling: {
    activityId: 'ceiling',
    questionNumber: '03',
    title: '쌍용각보개',
    description: '쌍용각보개는 국왕의 상징인 용을 화려하게 장식해 신성과 위엄을 강조했습니다. 정전이나 편전에서 국왕 자리의 어디에 설치되던 보개일까요?',
    image: ceilingImage,
    answerField: 'ceilingUsage',
    answerPlaceholder: '답을 입력하세요',
    explanation: '쌍용각보개는 정전이나 편전에서 국왕의 자리 위 천장에 설치되었습니다. 용은 국왕의 상징으로, 이 보개는 국왕의 신성과 위엄을 강조하는 장식품으로 사용되었습니다.',
    customCss: 'Question03_Ceiling.css',
    inputType: 'single'
  },
  clothing: {
    activityId: 'clothing',
    questionNumber: '04',
    title: '국왕의 복식',
    description: '조선의 국왕은 참여하는 행사의 격에 맞는 복식을 갖춰 입음으로써 권위와 위엄을 보였습니다. 이 중 가장 격식있는 예복은 무엇일까요?',
    image: clothingImage,
    answerField: 'clothingAnswer',
    answerPlaceholder: '답을 입력하세요',
    explanation: '면복은 조선 국왕이 입는 가장 격식 있는 예복입니다. 대례나 제례 등 중요한 의식에서 착용되었으며, 국왕의 권위와 위엄을 상징하는 복식이었습니다.',
    customCss: 'Question04_Clothing.css',
    inputType: 'single'
  },
  nature: {
    activityId: 'nature',
    questionNumber: '05',
    title: '일월오봉도',
    description: '일월오봉도에 그려진 다섯 가지 자연물을 적어보세요.',
    image: natureImage,
    answerField: 'natures',
    answerPlaceholder: '',
    explanation: '일월오봉도에는 해, 달, 물, 소나무, 산봉우리 다섯 가지 자연물이 그려져 있습니다. 이들은 국왕의 덕과 통치를 상징하며, 왕실의 권위를 나타내는 상징적인 요소들입니다.',
    customCss: 'Question05_Nature.css',
    inputType: 'multiple',
    multipleCount: 5,
    multipleLabels: ['1번째 자연물', '2번째 자연물', '3번째 자연물', '4번째 자연물', '5번째 자연물']
  },
  sealAnimal: {
    activityId: 'education',
    questionNumber: '06',
    title: '국왕의 교육',
    description: '왕위계승자인 원자가 글을 배우기 전까지의 교육을 맡던 시설을 무엇이라고 할까요?',
    image: educationImage,
    answerField: 'educationAnswer',
    answerPlaceholder: '시설의 이름을 입력하세요',
    explanation: '보양청은 왕위계승자인 원자가 글을 배우기 전까지의 교육을 맡던 시설입니다. 원자의 초기 교육과 양육을 담당하는 중요한 기관이었습니다.',
    customCss: null,
    inputType: 'single'
  },
  ceremonialSeal: {
    activityId: 'ceremonialSeal',
    questionNumber: '07',
    title: '의례용 인장',
    description: '조선 왕실의 의례용 인장으로, 왕비, 왕세자 등을 책봉하거나 덕을 기리는 이름을 올릴 때 지위와 이름을 새겼던 이것은 무엇일까요?',
    image: ceremonialSealImage,
    answerField: 'sealAnswer',
    answerPlaceholder: '인장의 이름을 입력하세요',
    explanation: '어보는 조선 왕실의 의례용 인장으로, 왕비, 왕세자 등을 책봉하거나 덕을 기리는 이름을 올릴 때 지위와 이름을 새겼던 중요한 도장입니다. 왕실의 권위를 상징하는 중요한 유물입니다.',
    customCss: null,
    inputType: 'single'
  },
  record: {
    activityId: 'record',
    questionNumber: '08',
    title: '국왕 통치의 기록',
    description: '역대 국왕의 통치 행위 중 후대 왕이 본받을 만한 훌륭한 정치를 추려서 모은 책을 무엇이라고 하나요?',
    image: recordImage,
    answerField: 'recordAnswer',
    answerPlaceholder: '책의 이름을 입력하세요',
    explanation: '국조보감은 역대 국왕의 통치 행위 중 후대 왕이 본받을 만한 훌륭한 정치를 추려서 모은 책입니다. 조선 왕조의 통치 철학과 정치 사상을 담은 중요한 역사서입니다.',
    customCss: null,
    inputType: 'single'
  },
  politics: {
    activityId: 'politics',
    questionNumber: '09',
    title: '신하와 함께하는 정치',
    description: '조선의 신하는 국왕이 올바른 정치를 하도록 돕고 함께 나라를 다스렸습니다. 조선에서 국정을 총괄하는 기관은 무엇이었을까요?',
    image: politicsImage,
    answerField: 'politicsAnswer',
    answerPlaceholder: '기관의 이름을 입력하세요',
    explanation: '의정부는 조선에서 국정을 총괄하는 최고 기관이었습니다. 국왕과 신하들이 함께 나라를 다스리는 합의제 정치 체제의 중심이었으며, 중요한 국정을 논의하고 결정하는 역할을 담당했습니다.',
    customCss: null,
    inputType: 'single'
  },
  exam: {
    activityId: 'exam',
    questionNumber: '10',
    title: '이동춘 무과 홍패',
    description: '조선 왕실에서는 과거시험으로 인재를 등용했으며, 문관을 뽑는 문과, 무관을 뽑는 무과, 전문기술관을 뽑는 잡과가 있었습니다. 위 사진은 이동춘이 무과 병과에 합격한 증서인 홍패입니다. 이 때, 몇 등으로 합격했을까요?',
    image: examImage,
    answerField: 'examAnswer',
    answerPlaceholder: '등수를 입력하세요',
    explanation: '이동춘은 무과 병과에 343등으로 합격했습니다. 조선 시대 과거시험은 문과, 무과, 잡과로 나뉘어 인재를 선발했으며, 무과는 무관을 뽑는 시험이었습니다.',
    customCss: null,
    inputType: 'single'
  },
  age: {
    activityId: 'age',
    questionNumber: '11',
    title: '기상패인갱재록',
    description: '기상패인갱재록은 영조가 기로소의 당상관을 만난 뒤 하사한 시와 왕세손, 기로소 신하들이 화답해 올린 시를 모은 책입니다. 기로소는 관직에서 물러난 나이 든 문신을 예우하기 위해 설치한 관청입니다. 이 기로소에 들어갈 수 있는 나이는 몇 세 이상이었을까요?',
    image: ageImage,
    answerField: 'ageAnswer',
    answerPlaceholder: '나이를 입력하세요',
    explanation: '기로소는 관직에서 물러난 나이 든 문신을 예우하기 위해 설치한 관청입니다. 70세 이상의 문신들이 입소할 수 있었으며, 이들은 국가에 큰 공을 세운 인물들로 존경받았습니다.',
    customCss: null,
    inputType: 'single'
  },
  dragon: {
    activityId: 'dragon',
    questionNumber: '12',
    title: '경회루 연못출토 청동용',
    description: '1865~1868년 경복궁을 다시 지으면서 남긴 기록인 「경복궁 영건일기」에는 경회루에 청동으로 만든 용 한 쌍을 가라앉혔다는 기록이 있는데, 무엇을 예방하기 위함이었을까요?',
    image: dragonImage,
    answerField: 'dragonAnswer',
    answerPlaceholder: '답을 입력하세요',
    explanation: '경회루에 청동으로 만든 용 한 쌍을 가라앉힌 것은 화재를 예방하기 위함이었습니다. 용은 물을 다스리는 신령으로 여겨져 화재 방지의 상징으로 사용되었습니다.',
    customCss: null,
    inputType: 'single',
    imageStyle: { backgroundPosition: 'left center' }
  },
  queenSymbol: {
    activityId: 'queenSymbol',
    questionNumber: '01',
    title: '왕비의 상징',
    description: '조선의 왕비는 책봉될 때 왕비의 상징물을 받았습니다. 교명, 옥책, 금보, 명복을 받았는데 왕비의 금보에는 어떤 문구가 새겨져 있을까요?',
    image: queenSealImage,
    answerField: 'queenSealAnswer',
    answerPlaceholder: '답을 입력하세요',
    explanation: '왕비의 금보에는 \'왕비지보\'라는 문구가 새겨져 있었습니다. 이는 왕비의 지위와 권위를 상징하는 중요한 인장으로, 왕비 책봉 시 받는 상징물 중 하나였습니다.',
    customCss: null,
    inputType: 'single'
  },
  queenVirtue: {
    activityId: 'queenVirtue',
    questionNumber: '02',
    title: '왕비의 덕목',
    description: '오륜행실도는 1797년 이병모 등이 왕명에 따라 『삼강행실도』와 『이륜행실도』를 모아 수정·편찬한 책입니다. 오륜행실도권3에는 열녀에 대한 내용을 수록했는데 몇 명의 열녀가 수록되어 있을까요?',
    image: oryunImage,
    answerField: 'queenVirtueAnswer',
    answerPlaceholder: '인원수를 입력하세요',
    explanation: '오륜행실도권3에는 35명의 열녀가 수록되어 있습니다. 오륜행실도는 조선 후기 유교 윤리를 보급하기 위해 편찬된 교화서로, 열녀편은 여성의 덕목과 행실을 보여주는 중요한 내용입니다.',
    customCss: null,
    inputType: 'single'
  },
  queenPolitics: {
    activityId: 'queenPolitics',
    questionNumber: '03',
    title: '왕비의 정치 활동',
    description: '조선의 왕비는 다양한 방식으로 정치적인 영향력을 행사할 수 있었습니다. 어린 국왕이 즉위할 경우 국왕의 보호자 역할을 하며 국왕이 성인이 될 때까지 국정을 운영하는 것을 4글자로 무엇이라고 할까요?',
    image: suryeomImage,
    answerField: 'queenPoliticsAnswer',
    answerPlaceholder: '4글자를 입력하세요',
    explanation: '수렴청정은 어린 국왕이 즉위할 경우 대비나 대왕대비가 국왕의 보호자 역할을 하며 국왕이 성인이 될 때까지 국정을 운영하는 제도입니다. 왕비가 정치적으로 중요한 역할을 할 수 있었던 대표적인 사례입니다.',
    customCss: null,
    inputType: 'single'
  },
  queenSymbol2: {
    activityId: 'queenSymbol2',
    questionNumber: '04',
    title: '왕비의 상징',
    description: '적의는 조선 시대 왕비와 왕세자빈, 대한제국기 황후와 황태자비의 궁중대례복으로, 가장 격식 있는 여성 예복입니다. 영친왕비(1901~1989)가 입었던 적의애는 꿩과 오얏꽃 무늬를 직조했는데 이것들은 무엇을 상징할까요?',
    image: yeongchinImage,
    answerField: 'queenSymbol2Answer',
    answerPlaceholder: '',
    explanation: '적의에 새겨진 꿩과 오얏꽃 무늬는 \'친애\'와 \'해로\'를 상징합니다. 친애는 부부 간의 사랑을, 해로는 부부가 함께 늙어가는 것을 의미하며, 왕비의 덕목과 부부 화합을 나타내는 상징입니다.',
    customCss: null,
    inputType: 'multiple',
    multipleCount: 2,
    multipleLabels: ['1번째 상징', '2번째 상징']
  },
  queenHairpin: {
    activityId: 'queenHairpin',
    questionNumber: '05',
    title: '영친왕비 도금가란화잠',
    description: '이 비녀에는 어떤 무늬가 새겨져 있을까요?',
    image: hairpinImage,
    answerField: 'queenHairpinAnswer',
    answerPlaceholder: '무늬를 입력하세요',
    explanation: '영친왕비 도금가란화잠에는 난초 무늬가 새겨져 있습니다. 난초는 고결한 품격과 절개를 상징하며, 왕비의 덕목을 나타내는 중요한 문양입니다.',
    customCss: null,
    inputType: 'single'
  },
  queenBirth: {
    activityId: 'queenBirth',
    questionNumber: '06',
    title: '왕실의 출산',
    description: '허준(1539~1615) 등이 선조(재위 1567~1608)의 명을 받들어 의서를 집성하고, 치료법을 정리해 편찬한 한의학 서적의 이름은 무엇을까요?',
    image: donguibogamImage,
    answerField: 'queenBirthAnswer',
    answerPlaceholder: '서적의 이름을 입력하세요',
    explanation: '동의보감은 허준이 선조의 명을 받들어 편찬한 한의학 서적입니다. 조선 시대 의학의 집대성으로 평가받는 중요한 의서로, 왕실의 출산과 건강 관리에도 활용되었습니다.',
    customCss: null,
    inputType: 'single'
  },
  queenPrincess: {
    activityId: 'queenPrincess',
    questionNumber: '07',
    title: '조선의 왕자와 공주',
    description: '이 인장을 사용한 공주는 어떤 왕의 딸이었을까요?',
    image: deokonPrincessSealImage,
    answerField: 'queenPrincessAnswer',
    answerPlaceholder: '왕의 이름을 입력하세요',
    explanation: '덕온공주는 순조의 딸이었습니다. 이 인장은 덕온공주가 사용한 것으로, 조선 왕실의 공주들이 사용하던 인장의 형태와 의미를 보여주는 중요한 유물입니다.',
    customCss: null,
    inputType: 'single'
  },
  queenClothing: {
    activityId: 'queenClothing',
    questionNumber: '08',
    title: '왕실의 옷',
    description: '원삼은 왕실 여성들이 크고 작은 행사 때 착용한 예복으로, 깃 부분이 둥근 모양이기 때문에 \'원삼\'이라 불리게 되었습니다. 지위에 따라 원삼의 색과 장식 등을 달리 했는데, 그 예로 황후는 황색 원삼을 착용했습니다. 그렇다면 왕비는 어떤 색의 원삼을 입었을까요?',
    image: queenWonsamImage,
    answerField: 'queenClothingAnswer',
    answerPlaceholder: '색을 입력하세요',
    explanation: '왕비는 홍색(빨간색) 원삼을 착용했습니다. 원삼은 왕실 여성들의 예복으로, 지위에 따라 색상이 달랐습니다. 황후는 황색, 왕비는 홍색 원삼을 입었으며, 이는 조선 왕실의 복식 제도에서 중요한 구분이었습니다.',
    customCss: null,
    inputType: 'single'
  },
  queenChima: {
    activityId: 'queenChima',
    questionNumber: '09',
    title: '스란치마',
    description: '당의와 스란치마는 조선 시대 왕실 여성들이 예복으로 착용했습니다. 여기서 스란치마는 왕실 여성이 예복 차림을 할 때 하의로 갖추는 치마입니다. \'스란\'은 각종 무늬를 금직 또는 금박으로 장식한 단을 말하는데요. 여기서 스란이 한 단인 것은 \'스란치마\'라고 불렀다면 스란이 두 단인 것은 무엇이라고 불렀을까요?',
    image: queenChimaImage,
    answerField: 'queenChimaAnswer',
    answerPlaceholder: '치마의 이름을 입력하세요',
    explanation: '스란이 두 단인 치마는 \'대란치마\'라고 불렀습니다. 스란치마는 스란이 한 단인 치마이고, 대란치마는 스란이 두 단인 치마로, 왕실 여성들의 예복에서 더 격식 높은 형태였습니다.',
    customCss: null,
    inputType: 'single'
  },
  queenJewelry: {
    activityId: 'queenJewelry',
    questionNumber: '10',
    title: '왕실의 장신구',
    description: '왕실 여성이 당의와 같은 예복을 갖출 때 함께 착용한 것으로 진한 감청색 비단에 백옥으로 연화, \'수\', \'복\', \'희\'자를 장식한 이것은 무엇일까요?',
    image: queenJokduriImage,
    answerField: 'queenJewelryAnswer',
    answerPlaceholder: '장신구의 이름을 입력하세요',
    explanation: '족두리는 왕실 여성이 당의와 같은 예복을 갖출 때 함께 착용한 머리 장식입니다. 진한 감청색 비단으로 만들어진 족두리에는 백옥으로 연화(연꽃) 무늬와 \'수\'(壽, 장수), \'복\'(福, 복), \'희\'(喜, 기쁨) 자가 장식되어 있어 왕실 여성의 품격과 복을 기원하는 의미를 담고 있습니다.',
    customCss: null,
    inputType: 'single'
  },
  queenEmbroidery: {
    activityId: 'queenEmbroidery',
    questionNumber: '11',
    title: '왕실의 자수',
    description: '조선 왕실에서는 옷과 침구, 병풍, 장신구 등에 좋은 의미의 문양을 수놓아 사용했습니다. 왕실 자수는 광택이 있는 가느다란 비단실을 섬세한 솜씨로 수놓아 완성했는데요. 자수는 보기에 아름다울 뿐만아니라 복을 기원하는 길상적인 의미를 가지고 있었습니다. 여기서 자수의 문양을 통해 사용자의 무엇을 나타내었을까요?',
    image: queenEmbroideryImage,
    answerField: 'queenEmbroideryAnswer',
    answerPlaceholder: '답을 입력하세요',
    explanation: '조선 왕실의 자수는 문양을 통해 사용자의 신분을 나타냈습니다. 왕실 자수는 광택이 있는 가느다란 비단실로 섬세하게 수놓았으며, 십장생문과 같은 길상적인 문양을 사용하여 복을 기원하는 의미를 담았습니다. 이러한 정교한 자수와 특정 문양은 왕실의 높은 신분과 권위를 상징했습니다.',
    customCss: null,
    inputType: 'single'
  },
  queenNorigae: {
    activityId: 'queenNorigae',
    questionNumber: '12',
    title: '왕실의 장신구',
    description: '연꽃 모양 자수 노리개는 연꽃과 나비를 수놓은 향낭으로 만든 노리개로, 연꽃은 진흙 속에서도 아름다운 꽃을 피워 절개와 고귀함을 상징하는데요. 나비는 무엇을 상징할까요?',
    image: queenNorigaeImage,
    answerField: 'queenNorigaeAnswer',
    answerPlaceholder: '답을 입력하세요',
    explanation: '나비는 부부의 영원한 사랑을 상징합니다. 연꽃 모양 자수 노리개는 연꽃과 나비를 함께 수놓아 부부의 화합과 영원한 사랑을 나타냈습니다. 연꽃은 절개와 고귀함을, 나비는 부부의 영원한 사랑을 상징하여 왕실 여성들의 덕목과 부부 화합을 기원하는 의미를 담고 있습니다.',
    customCss: null,
    inputType: 'single'
  },
  queenFood: {
    activityId: 'queenFood',
    questionNumber: '13',
    title: '왕실의 식문화',
    description: '직물 위에 채색 안료로 화려한 무늬를 그려 넣은 보자기로, 왕실 가례와 같이 경사스러운 날에 사용했으며, 보자기의 중앙에 봉황 한 쌍을 그리고, 그 주변으로 구획을 두어 다양한 길상 무늬를 그려 장식한 이 것은 무엇일까요?',
    image: queenInmunboImage,
    answerField: 'queenFoodAnswer',
    answerPlaceholder: '보자기의 이름을 입력하세요',
    explanation: '인문보는 직물 위에 채색 안료로 화려한 무늬를 그려 넣은 보자기로, 왕실 가례와 같은 경사스러운 날에 사용되었습니다. 보자기의 중앙에 봉황 한 쌍을 그리고, 그 주변으로 구획을 두어 다양한 길상 무늬를 그려 장식하여 왕실의 품격과 복을 기원하는 의미를 담고 있습니다.',
    customCss: null,
    inputType: 'single'
  },
  empire: {
    activityId: 'empire',
    questionNumber: '01',
    title: '대한제국',
    description: '조선 26대 왕 고종은 부국강병한 근대국가를 건설하기 위해 다양한 개혁과 정책을 추진하였습니다. 또한 황제의 나라, 대한제국을 선포했는데요. 대한제국을 선포한 년도는 몇 년 일까요?',
    image: empireImage,
    answerField: 'empireAnswer',
    answerPlaceholder: '년도를 입력하세요',
    explanation: '고종은 1897년 10월 12일 대한제국을 선포했습니다. 이는 조선이 근대 국가로 전환하는 중요한 역사적 사건으로, 황제국 체제를 통해 독립과 자주권을 강화하고자 한 시도였습니다.',
    customCss: null,
    inputType: 'single'
  },
  independence: {
    activityId: 'independence',
    questionNumber: '02',
    title: '고종과 순종',
    description: '서재필(1864~1951년)이 정부로부터 자금을 지원받아 1896년 4월 7일에 창간한 한국 최초의 민간 신문은 무엇일까요?',
    image: independenceImage,
    answerField: 'independenceAnswer',
    answerPlaceholder: '신문의 이름을 입력하세요',
    explanation: '독립신문은 서재필이 1896년 4월 7일에 창간한 한국 최초의 민간 신문입니다. 한글과 영문으로 발행되었으며, 민주주의와 자주독립 사상을 전파하는 데 중요한 역할을 했습니다. 이 신문은 근대 한국 언론의 출발점이 되었습니다.',
    customCss: null,
    inputType: 'single'
  },
  currency: {
    activityId: 'currency',
    questionNumber: '03',
    title: '최초의 지폐',
    description: '우리나라 최초의 지폐이자 신·구화폐를 교환할 수 있는 화폐교환 증서로, 근대적 화폐제도의 도입을 위해 설립한 태환서에서 발행한 이 지폐의 이름은 무었을까요?',
    image: currencyImage,
    answerField: 'currencyAnswer',
    answerPlaceholder: '지폐의 이름을 입력하세요',
    explanation: '호조태환권은 우리나라 최초의 지폐이자 신·구화폐를 교환할 수 있는 화폐교환 증서입니다. 근대적 화폐제도의 도입을 위해 설립한 태환서에서 발행되었으며, 대한제국 시기 근대 금융제도의 출발점이 되었습니다.',
    customCss: null,
    inputType: 'single'
  },
  altar: {
    activityId: 'altar',
    questionNumber: '04',
    title: '황제국의 상징',
    description: '동지와 정월 첫 신일에 황태자와 문무백관이 참석한 가운데 하늘 신, 땅 신, 그리고 왕조의 시조인 태조고황제 등을 비롯한 다양한 신들에게 제사를 올렸던 제단의 이름은 무엇일까요?',
    image: altarImage,
    answerField: 'altarAnswer',
    answerPlaceholder: '제단의 이름을 입력하세요',
    explanation: '환구단은 동지와 정월 첫 신일에 황태자와 문무백관이 참석한 가운데 하늘 신, 땅 신, 그리고 왕조의 시조인 태조고황제 등을 비롯한 다양한 신들에게 제사를 올렸던 제단입니다. 대한제국 시기 황제국의 상징으로 중요한 의례 공간이었습니다.',
    customCss: null,
    inputType: 'single'
  },
  palace: {
    activityId: 'palace',
    questionNumber: '05',
    title: '대한제국의 황궁',
    description: '대한제국의 법궁이자 도시 근대화 사업의 중심이었으며 1896년 아관파천 이후, 궁역을 확장하고 전각을 신축하였으며 궐내에 서양식 건축물을 지어 근대화를 상징하는 공간으로 삼기도 하였습니다. 1907년 고종이 일제에 의해 강제로 퇴위된 후 순종이 창덕궁으로 거처를 옮김에 따라 선황제가 거처하는 궁궐이 되었고 오늘날 덕수궁으로 불리는 이 궁의 이름은 무엇일까요?',
    image: palaceImage,
    answerField: 'palaceAnswer',
    answerPlaceholder: '궁궐의 이름을 입력하세요',
    explanation: '경운궁은 대한제국의 법궁이자 도시 근대화 사업의 중심이었습니다. 1896년 아관파천 이후 궁역을 확장하고 전각을 신축하였으며, 궐내에 서양식 건축물을 지어 근대화를 상징하는 공간으로 삼았습니다. 1907년 고종이 일제에 의해 강제로 퇴위된 후 순종이 창덕궁으로 거처를 옮김에 따라 선황제가 거처하는 궁궐이 되었고, 오늘날 덕수궁으로 불립니다.',
    customCss: null,
    inputType: 'single'
  },
  dondeokjeon: {
    activityId: 'dondeokjeon',
    questionNumber: '06',
    title: '궁궐 내 근대시설의 도입',
    description: '서양식 건물로 고종이 외국 사신을 접견하거나 연회를 개최했던 곳으로, 1907년에는 순종의 황제 즉위식을 거행하였다. 대한제국의 역사와 함께 한 중요한 건물이었으나 고종 사후 일제에 의해 철거된 이 곳은 어디일까요?',
    image: dondeokjeonImage,
    answerField: 'dondeokjeonAnswer',
    answerPlaceholder: '건물의 이름을 입력하세요',
    explanation: '돈덕전은 서양식 건물로 고종이 외국 사신을 접견하거나 연회를 개최했던 곳입니다. 1907년에는 순종의 황제 즉위식을 거행하였으며, 대한제국의 역사와 함께 한 중요한 건물이었습니다. 그러나 고종 사후 일제에 의해 철거되어 현재는 그 흔적만 남아 있습니다.',
    customCss: null,
    inputType: 'single'
  },
  plumBlossom: {
    activityId: 'plumBlossom',
    questionNumber: '07',
    title: '대한제국 상징 문양',
    description: '대한제국 시기 주로 쓰였던 상징 문양은 태극, 무궁화, 매 와 이것으로 여권, 초청장 등에서 볼 수 있는 이 꽃의 이름은 무엇일까요?',
    image: passportImage,
    answerField: 'plumBlossomAnswer',
    answerPlaceholder: '꽃의 이름을 입력하세요',
    explanation: '오얏꽃(오앗꽃)은 대한제국 시기 주로 쓰였던 상징 문양 중 하나입니다. 태극, 무궁화, 매와 함께 대한제국의 상징으로 사용되었으며, 여권, 초청장 등 공식 문서에서 볼 수 있었습니다. 오얏꽃은 대한제국의 국가 상징으로 중요한 의미를 담고 있었습니다.',
    customCss: null,
    inputType: 'single'
  },
  hwajodo: {
    activityId: 'hwajodo',
    questionNumber: '01',
    title: '화조도가리개',
    description: '화조도가리개의 제2폭에는 장수를 상징하는 바위와 국화를 층층이 그려 익수의 의미를 더하였습니다. 바위 위로 산초나무와 한 쌍의 새를 그렸는데 산초열매가 뜻하는 것은 무엇일까요?',
    image: hwajodoImage,
    answerField: 'hwajodoAnswer',
    answerPlaceholder: '답을 입력하세요',
    explanation: '산초열매는 다산을 상징합니다. 화조도가리개 제2폭에는 장수를 상징하는 바위와 국화를 층층이 그려 익수의 의미를 더하였으며, 바위 위로 산초나무와 한 쌍의 새를 그려 다산과 부부 화합을 나타냈습니다. 산초나무는 많은 열매를 맺는 특성으로 인해 자손 번성을 의미하는 길상 문양으로 사용되었습니다.',
    customCss: null,
    inputType: 'single'
  },
  peony: {
    activityId: 'peony',
    questionNumber: '02',
    title: '궁궐의 장식그림',
    description: '예부터 크고 화려한 모양으로 인해 부귀와 풍요의 상징으로 여겨졌고, \'꽃 중의 왕\'이라 일컬어 졌던 이 꽃은 무엇일까요?',
    image: peonyImage,
    answerField: 'peonyAnswer',
    answerPlaceholder: '꽃의 이름을 입력하세요',
    explanation: '모란은 예부터 크고 화려한 모양으로 인해 부귀와 풍요의 상징으로 여겨졌고, \'꽃 중의 왕\'이라 일컬어졌습니다. 궁궐의 장식그림으로 자주 사용되었으며, 모란도병풍은 왕실의 부귀와 번영을 상징하는 중요한 궁중 서화 작품입니다.',
    customCss: null,
    inputType: 'single'
  },
  sealBook: {
    activityId: 'sealBook',
    questionNumber: '03',
    title: '조선 왕실의 사인',
    description: '인장에 관심이 컷던 현종(재위 1834~1849년)이 ㅎ어인을 포함해 역대 군왕 및 국내외 명사들의 인장을 모아 만든 이 책의 이름은 무엇일까요?',
    image: sealBookImage,
    answerField: 'sealBookAnswer',
    answerPlaceholder: '책의 이름을 입력하세요',
    explanation: '보소당인존은 인장에 관심이 있던 현종(재위 1834~1849년)이 어인을 포함해 역대 군왕 및 국내외 명사들의 인장을 모아 만든 책입니다. 조선 왕실의 인장 수집과 보관에 대한 관심을 보여주는 중요한 서화 자료로, 왕실의 문화적 취향과 예술적 감식을 엿볼 수 있는 작품입니다.',
    customCss: null,
    inputType: 'single'
  },
  inkstone: {
    activityId: 'inkstone',
    questionNumber: '04',
    title: '조선 왕실의 문예취미',
    description: '이 벼루의 몸체는 연잎 모양으로 조각했고, 벼루함 뚜껑은 나무로 제작한 뒤 윗면에 자개를 붙여 용무늬와 구름무늬를 표현하였는데 이 벼루는 평안북도 압록강변에 위치한 위원지방에서 나는 어떠한 돌로 만든 벼루일까요?',
    image: inkstoneImage,
    answerField: 'inkstoneAnswer',
    answerPlaceholder: '돌의 이름을 입력하세요',
    explanation: '징니석은 평안북도 압록강변에 위치한 위원지방에서 나는 돌로, 조선 왕실에서 벼루를 만드는 데 사용되었습니다. 이 벼루는 몸체를 연잎 모양으로 조각하고, 벼루함 뚜껑은 나무로 제작한 뒤 윗면에 자개를 붙여 용무늬와 구름무늬를 표현하여 왕실의 문예취미와 예술적 감각을 보여주는 작품입니다.',
    customCss: null,
    inputType: 'single'
  },
  fiveRites: {
    activityId: 'fiveRites',
    questionNumber: '01',
    title: '왕실의례, 예치국가 조선',
    description: '조선은 \'예\'를 기초로 다섯 가지 예제를 정비하였는데, 이 다섯 가지 예는 무엇일까요?',
    image: fiveRitesImage,
    answerField: 'fiveRitesAnswer',
    answerPlaceholder: '',
    explanation: '조선은 다섯 가지 예제를 정비하여 왕실의 정치적 권위와 정통성을 확립했습니다. 이 다섯 가지 예는 길례(吉禮, 제사), 흉례(凶禮, 상례), 군례(軍禮, 군사 의례), 빈례(賓禮, 외교 의례), 가례(嘉禮, 경사 의례)입니다. 이 오례는 조선 왕조가 유학을 통치철학으로 하여 \'예\'를 기초로 사회질서를 지키고 백성과 화합하고자 한 핵심 제도였습니다.',
    customCss: null,
    inputType: 'multiple',
    multipleCount: 5,
    multipleLabels: ['1번째 예', '2번째 예', '3번째 예', '4번째 예', '5번째 예']
  },
  dongroe: {
    activityId: 'dongroe',
    questionNumber: '02',
    title: '왕실의 혼례',
    description: '왕실 혼례 절차 중 왕과 왕비가 술과 음식을 함께 먹으며 인연을 맺는 궁중 잔치이자 절차를 뜻하는 조선시대 전통 혼례의 핵심 의식 중 하나인 이것은 무엇일까요?',
    image: dongroeImage,
    answerField: 'dongroeAnswer',
    answerPlaceholder: '의식의 이름을 입력하세요',
    explanation: '동뢰연(同牢宴)은 왕실 혼례 절차 중 왕과 왕비가 술과 음식을 함께 먹으며 인연을 맺는 궁중 잔치이자 절차입니다. 조선시대 전통 혼례의 핵심 의식 중 하나로, 부부가 한 상에서 함께 식사를 하며 부부의 인연을 맺는 의식입니다. 이 의식은 혼례의 중요한 절차로, 왕과 왕비가 부부로서의 관계를 공식적으로 맺는 상징적인 의미를 담고 있습니다.',
    customCss: null,
    inputType: 'single'
  },
  daesarye: {
    activityId: 'daesarye',
    questionNumber: '03',
    title: '왕과 신하의 활쏘기 대회',
    description: '국왕과 신하가 모여 성균관에서 활을 쏘는 의례를 뜻하며, 위계질서를 바로잡고 화합을 이루고자 하였던 이 의례의 이름은 무엇일까요?',
    image: daesaryeImage,
    answerField: 'daesaryeAnswer',
    answerPlaceholder: '의례의 이름을 입력하세요',
    explanation: '대사례(大射禮)는 국왕과 신하가 모여 성균관에서 활을 쏘는 의례입니다. 이 의례는 위계질서를 바로잡고 화합을 이루고자 하였던 중요한 왕실 의식으로, 국왕과 신하들이 함께 참여하여 활쏘기 실력을 겨루는 행사였습니다. 대사례는 조선 왕조의 군례(軍禮) 중 하나로, 무예를 연마하고 신하들과의 관계를 돈독히 하는 의미를 담고 있었습니다.',
    customCss: null,
    inputType: 'single'
  },
  yeon: {
    activityId: 'yeon',
    questionNumber: '04',
    title: '가마',
    description: '대비, 왕, 왕비, 왕세자, 왕세자빈이 행차 때 탔던 정식 가마로, 지붕, 몸체, 가마체로 구성되어 각각 분리가 되게 만들어진 이 가마의 이름은 무엇일까요?',
    image: yeonImage,
    answerField: 'yeonAnswer',
    answerPlaceholder: '가마의 이름을 입력하세요',
    explanation: '연(輦)은 대비, 왕, 왕비, 왕세자, 왕세자빈이 행차 때 탔던 정식 가마입니다. 지붕, 몸체, 가마체로 구성되어 각각 분리가 되게 만들어진 구조로, 왕실의 위엄과 권위를 상징하는 중요한 의례용품입니다. 연은 조선 왕조의 중요한 의례에서 사용되었으며, 왕실 구성원들의 신분과 지위를 나타내는 상징적인 의미를 담고 있었습니다.',
    customCss: null,
    inputType: 'single'
  },
  jeongchukgi: {
    activityId: 'jeongchukgi',
    questionNumber: '05',
    title: '왕실의례를 드높인 의장',
    description: '왕이 행차할 때 사용된 의장기로 부적 문자를 그린 육정기 중 하나입니다. 중앙에 부적 문자를 그리고 그 위에는 화관을 쓴 신의 형상을, 그 아래에는 각 신을 상징하는 동물을 그리는 데 소의 머리 모양이 그려진 이 의장기의 이름은 무엇일까요?',
    image: jeongchukgiImage,
    answerField: 'jeongchukgiAnswer',
    answerPlaceholder: '의장기의 이름을 입력하세요',
    explanation: '정축기(丁丑旗)는 왕이 행차할 때 사용된 의장기로 부적 문자를 그린 육정기 중 하나입니다. 중앙에 부적 문자를 그리고 그 위에는 화관을 쓴 신의 형상을, 그 아래에는 각 신을 상징하는 동물을 그리는데, 정축기에는 소의 머리 모양이 그려져 있습니다. 육정기는 조선 왕조의 중요한 의례에서 사용된 의장기로, 왕실의 위엄과 권위를 상징하는 중요한 의례용품입니다.',
    customCss: null,
    inputType: 'single'
  },
  honjeondogam: {
    activityId: 'honjeondogam',
    questionNumber: '06',
    title: '왕의 장례식',
    description: '왕의 장례식은 3년간 70여 가지의 절차에 따라 치러졌기 때문에 여러 개의 임시 관청이 설치되어 업무를 분담하였는데 장례 후 혼전에 신주를 모시고 삼년상을 치르는 일을 맡았던 관청은 무엇일까요?',
    image: funeralImage,
    answerField: 'honjeondogamAnswer',
    answerPlaceholder: '관청의 이름을 입력하세요',
    explanation: '혼전도감(魂殿都監)은 왕의 장례식에서 장례 후 혼전에 신주를 모시고 삼년상을 치르는 일을 맡았던 임시 관청입니다. 왕의 장례식은 3년간 70여 가지의 절차에 따라 치러졌기 때문에 여러 개의 임시 관청이 설치되어 업무를 분담하였으며, 혼전도감은 그 중에서도 장례 후 혼전에서 신주를 모시고 삼년상을 치르는 중요한 역할을 담당했습니다. 이는 조선 왕조의 상례(喪禮) 제도에서 매우 중요한 부분이었습니다.',
    customCss: null,
    inputType: 'single'
  },
  jongmyo: {
    activityId: 'jongmyo',
    questionNumber: '07',
    title: '왕실 사당',
    description: '17세기에 중건된 이래 온전하게 유지된 유교적 왕실 사당으로 1995년 유네스코 세계문화유산으로 등재되었으며, 역대 왕과 왕비의 신위를 봉안하고 제향 의식을 행하는 장소로 왕실의 근본이자 정통성의 기반인 이 곳은 어디일까요?',
    image: jongmyoImage,
    answerField: 'jongmyoAnswer',
    answerPlaceholder: '장소의 이름을 입력하세요',
    explanation: '종묘(宗廟)는 17세기에 중건된 이래 온전하게 유지된 유교적 왕실 사당으로, 1995년 유네스코 세계문화유산으로 등재되었습니다. 역대 왕과 왕비의 신위를 봉안하고 제향 의식을 행하는 장소로, 왕실의 근본이자 정통성의 기반이 되는 곳입니다. 종묘는 조선 왕조의 가장 중요한 제사 공간으로, 정전과 영녕전에 역대 왕과 왕비의 신위가 봉안되어 있으며, 매년 봄과 가을에 제향 의식이 거행되었습니다.',
    customCss: null,
    inputType: 'single'
  },
  honcheoneui: {
    activityId: 'honcheoneui',
    questionNumber: '01',
    title: '조선의 천문 의기',
    description: '천체의 운행을 나타내고 위치를 측정하는 천문 의기였던 혼천의를 다른 이름으로 무엇이라고 불렀을까요?',
    image: honcheoneuiImage,
    answerField: 'honcheoneuiAnswer',
    answerPlaceholder: '다른 이름을 입력하세요',
    explanation: '혼천의(渾天儀)는 천체의 운행을 나타내고 위치를 측정하는 천문 의기로, 선기옥형(璇璣玉衡)이라고도 불렸습니다. 혼천의는 하늘을 둥근 구(球)로 보고, 그 안에 지구가 있다고 생각하는 혼천설에 기반한 천문 관측 기구입니다. 이 기구는 천체의 위치를 측정하고 운행을 관찰하는 데 사용되었으며, 조선 시대의 뛰어난 천문학적 성취를 보여주는 중요한 과학 기구입니다.',
    customCss: null,
    inputType: 'single'
  },
  calendar: {
    activityId: 'calendar',
    questionNumber: '02',
    title: '조선 왕실의 천문사업',
    description: '하늘의 여러 현상, 특히 천체의 움직임을 관측하는 것은 연, 월, 일, 절기 등 시간의 질서를 얻기 위함이었습니다. 천체의 움직임을 계산해 날짜를 정하는 수학적 이론이 역법이라면, 역법을 적용해 해마다 만드는 달력을 무엇이라고 할까요?',
    image: calendarImage,
    answerField: 'calendarAnswer',
    answerPlaceholder: '달력의 이름을 입력하세요',
    explanation: '역서(曆書)는 역법을 적용해 해마다 만드는 달력입니다. 하늘의 여러 현상, 특히 천체의 움직임을 관측하는 것은 연, 월, 일, 절기 등 시간의 질서를 얻기 위함이었으며, 천체의 움직임을 계산해 날짜를 정하는 수학적 이론이 역법입니다. 조선 왕실은 역법을 적용하여 매년 역서를 제작하여 시간의 질서를 확립하고, 농사와 의례 등 국가의 중요한 일정을 관리했습니다.',
    customCss: null,
    inputType: 'single'
  },
  ilseongjeongsiui: {
    activityId: 'ilseongjeongsiui',
    questionNumber: '03',
    title: '조선의 천문 의기',
    description: '낮에는 해의 움직임을 따라, 밤에는 별의 움직임을 관측해 시간을 측정했던 기구로, 1437년 세종의 명으로 처음 만들어 경복궁과 서운관, 함경도와 평안도에 각각 1개씩 두었던 이 기구의 이름은 무엇일까요?',
    image: ilseongjeongsiuiImage,
    answerField: 'ilseongjeongsiuiAnswer',
    answerPlaceholder: '기구의 이름을 입력하세요',
    explanation: '일성정시의(日星定時儀)는 낮에는 해의 움직임을 따라, 밤에는 별의 움직임을 관측해 시간을 측정했던 기구입니다. 1437년 세종의 명으로 처음 만들어 경복궁과 서운관, 함경도와 평안도에 각각 1개씩 두었습니다. 이 기구는 조선 시대의 뛰어난 천문학적 성취를 보여주는 중요한 과학 기구로, 하루 종일 시간을 측정할 수 있도록 설계되었습니다.',
    customCss: null,
    inputType: 'single'
  },
  soilyeong: {
    activityId: 'soilyeong',
    questionNumber: '04',
    title: '조선의 천문 의기',
    description: '해시계의 한 종류로, 밤낮 모두 사용하는 시계인 일성정시의에서 해시계의 기능만 살려 만든 시계로, 백각환, 받침대, 일영대로 구성되는 이 것은 무엇일까요?',
    image: soilyeongImage,
    answerField: 'soilyeongAnswer',
    answerPlaceholder: '시계의 이름을 입력하세요',
    explanation: '소일영(小日影)은 해시계의 한 종류로, 밤낮 모두 사용하는 시계인 일성정시의에서 해시계의 기능만 살려 만든 시계입니다. 백각환, 받침대, 일영대로 구성되며, 해의 그림자를 이용하여 시간을 측정하는 조선 시대의 중요한 과학 기구입니다. 소일영은 일성정시의의 해시계 기능을 단순화하여 더욱 실용적으로 만든 시계로, 조선의 뛰어난 과학 기술을 보여주는 작품입니다.',
    customCss: null,
    inputType: 'single'
  },
  cheonsangyeolchabunyajido: {
    activityId: 'cheonsangyeolchabunyajido',
    questionNumber: '05',
    title: '조선의 하늘',
    description: '하늘을 여러 구역으로 나누어 놓은 천문도로 돌에 새겨 만들었으며, 1,467개의 별과 295개의 별자리가 새겨져 있는 이 각석의 이름은 무엇일까요?',
    image: cheonsangyeolchabunyajidoImage,
    answerField: 'cheonsangyeolchabunyajidoAnswer',
    answerPlaceholder: '각석의 이름을 입력하세요',
    explanation: '천상열차분야지도(天象列次分野之圖)는 하늘을 여러 구역으로 나누어 놓은 천문도로 돌에 새겨 만들었으며, 1,467개의 별과 295개의 별자리가 새겨져 있는 각석입니다. 이 천문도는 조선 시대의 뛰어난 천문학적 성취를 보여주는 중요한 과학 유물로, 하늘의 별자리와 별의 위치를 정확하게 기록한 세계적으로도 드문 천문도입니다. 천상열차분야지도는 조선의 과학 기술과 천문학적 지식을 집대성한 작품으로 평가받고 있습니다.',
    customCss: null,
    inputType: 'single'
  }
}

