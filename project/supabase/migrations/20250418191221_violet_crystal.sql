/*
  # Add island references column and data

  1. Changes
    - Add island_reference column to locations table
    - Update locations with their island references
    
  2. Security
    - Uses existing RLS policies
*/

-- First add the column
ALTER TABLE locations ADD COLUMN IF NOT EXISTS island_reference text;

-- Then update the data
UPDATE locations 
SET island_reference = 'kahbaohera; kodadhiheragandu; kaohera; kandiheragandu; ismehelaahera; geskalhuheraa; gaukendi; fathikedeheragandu; addu-city-vilingili; aboohera; savaaheli; mulikede; kudhehera; kudamaahera; bodu-maahera; hikahera; kedevaahera; herethere; gomahera; hasanbeaarah; hankede; dhigiheraa; dheerondi; boduhajaraa; gan; bedhey-aurah; hulhudhoo; feydhoo; maradhoofeydhoo; meedhoo; maradhoo; hithadhoo'
WHERE slug = 'addu-city';

UPDATE locations 
SET island_reference = 'fusfinolhu; gaagandu-96ecd; kandholhudhoo-5b489; velifinolhu-e6f81; vihamaafaru; mathivereefinolhu; madivarufinolhu; madivaru-23ecb; maagau; gaathafushi; fushi; mushimasmigili; etheremadivaru; dhinnolhufinolhu; veligandu-5b705; velidhoo-02413; alikoirah; maayafushi; kudafolhudhoo; kuramathi; madoogali; halaveli; gangehi; ellaidhoo; bathalaa-1c404; fesdhoo; feridhoo; maalhos-e0ca5; himendhoo; bodufolhudhoo; mathiveri; ukulhas; thoddoo; rasdhoo'
WHERE slug = 'alifu-alifu';

UPDATE locations 
SET island_reference = 'lonuboi; theluveligaa; kudadhoo-0cf8a; tholhifushi; kalhahandhihuraa; innafushi-f81e7; hukurudhoo; huruelhi; hurasdhoo; hiyafushi; fushidhigga; heenfaru; dhiggiri; enboodhoo-51737; bodufinolhu-964eb; bodukaashihuraa; vilamendhoo; bulhalhohi; maafushivaru; vakarufalhi; thundufushi; nalaguraidhoo; moofushi; rangaleefinolhu; vilingilivaru; mirihi; kudarah; mahchafushi; huvahendhoo; dhiffushi-c6fd1; angaagau; athurugau; dhihdhoofinolhu; ariyadhoo; maamingili-76591; dhihdhoo-802f8; fenfushi-dc36a; dhigurah-c8ccc; dhangethi; mandhoo; mahibadhoo; kunburudhoo-7bbf9; omadhoo; rangali; hangnaameedhoo; ranfinolhu; athulivarufinolhu'
WHERE slug = 'alifu-dhaalu';

UPDATE locations 
SET island_reference = 'thiladhoo; vinaneiyfaruhuraa; veyofushi; voavah; vakkaru; ufuligiri; nibiligaa; nelivarufinolhu; olhugiri; muthaafushi; mudhdhoo; miriandhoo; medhufinolhugaathufinolhu; milaidhoo; mendhoo; maarikilu; madhirivaadhoo; maamaduvvari; maaddoohulhudhoo; kihavahhuravalhi; kudadhoo-395be; keyodhoo; kashidhuffarufinolhu; kanufusheegaathufinolhu; kanufushi; kashidhoo; innafushi-0a547; hulhudhoo-dcd52; hirundhoo; hibalhidhoo; hanifaru; gemendhoo; gaagandufaruhuraa; gaavilingili; fares; finolhas; enboodhoo; dhoogandufinolhu; dhigufaruvinagandu; dhigudhefaru; dhandhoo; bathalaa; bodufinolhu; boifushi; dhakandhoo; boadhaafushifinolhu; anhenunfushi; aidhoo; ahivaffushi; horubadhoo; kunfunadhoo; dhunikolhu; landaagiraavaru; kihaadhuffaru; fonimagoodhoo; goidhoo-18b26; fehendhoo; fulhadhoo; funadhoo-baa; hithaadhoo-baa; thulhaadhoo; eydhafushi; maalhos; dharavandhoo; dhonfanu; kihaadhoo; undoodhoo; maaddoo; kendhoo; bathalaahuraa; kudarikilu; finolhufaru; kamadhoo; angaafaru; dhashufaruhuraa; vandhuhmaafarufinolhu; maafusheefinolhu; mathifaru; velavaru; huraafaru; dhigufaru; hanifaruhuraa'
WHERE slug = 'baa';

UPDATE locations 
SET island_reference = 'vommuli; uhdhoo; thinhuraa; thanbalhaidhoo; olhufushi; thilabolhufushi; olhuveli-14521; minimasgali-d7860; maalefaru; maagau-371fa; maafushi-da938; maadheli; kedhigandu; kiraidhoo; kanneiyfaru; hulhuvahi; issari; hudhufusheefinolhu; hiriyafushi; dhebaidhoo; fenfushi-b8d0b; enboodhoofushi; dhoores; faandhoo; ayyakaloahuraa; lhohi-e19c6; aluvifushi; bulhalafushi; meedhuffushi; velavaru-7ad19; kudahuvadhoo; maaenboodhoo; vaanee; gemendhoo-91f7d; bandidhoo; hulhudheli; rinbudhoo; meedhoo-a4355; hinaidhoo; kudathilabolhufushi; sarakafushi; boarikifinolhu; vallalhohi; bodufushi-01836; kandinmaa; valla'
WHERE slug = 'dhaalu';

UPDATE locations 
SET island_reference = 'dhiguvarufinolhu; magoodhoobodufinolhu; vilingilivarufinolhu; makunueri; minimasgali; madivaruhuraa; kandumoonufushi; jinnathugau; himithi; enbulufushi; faanumaahuraa; adhangau; filitheyo; maafushi-35cae; nilandhoo; dharanboodhoo; feeali; magoodhoo-0a50d; bileiydhoo'
WHERE slug = 'faafu';

UPDATE locations 
SET island_reference = 'fuvahmulah'
WHERE slug = 'fuvahmulah-city';

UPDATE locations 
SET island_reference = 'vodamulaa; odagallaa; viligalaa; meradhoo; minimessaa; medharehaa; mahahdhoo; medhehuttaa; maarehaa; maamutaa; maarandhoo-386e5; mahthidhoo; maagihuttaa; maafehelaa; maadhigavara; lhossaa; kudalafari; kodahuttaa; kodeyvilingili; kondeymatheelaabadhoo; kisserahaa; kalhehuttaa; innarehaa; kanduvilingili; hurendhoo; idhimaa; hulhimendhoo-e83e4; hithaadhoogalaa; hinaamaagalaa; handahaa; funamauddaa; funadhooviligillaa; funadhoo-gaafu-alifu; falhumaafushi; fulangi; faruhulhudhoo; fenrehaa; dhigudhoo; dhigurah-f0be0; dhevvalaabadhoo; dhevvaamaagalaa; bodehuttaa; beyrumauddoo; bodubondeyyaa; bakehthaa; baaberehutta; baavanadhoo; gemanafushi; araigahthaa; kendheraa; kooddoo; kanduhulhudhoo; kondey; dhiyadhoo; dhevvadhoo; dhaandhoo; nilandhoo-234dd; maamendhoo-b1107; kolamaafushi; vilingili-23a20; melaimaa; matu; medhuburiyaa; maakanaarataa; mahthurehaa; raaverrehaa; munandhuvaa; hirihuttaa; hithaadhoo-gaafu-alifu; kodagehuttaa; boduhuttaa; galamedhuvaa; kaludirehaa; keredhdhoo; fenfuttaa; faruhulhedhoo; bihurehaa; bodufinolhu-fb01c; boadduvaa'
WHERE slug = 'gaafu-alifu';

UPDATE locations 
SET island_reference = 'bodehuttaa-3b991; bodehutta; femunaidhoo; gahevelagalaa; fenevenhuttaa; farukolhuhuttaa; ekelondaa; dhoonirehaa-62cb3; ehivakaa; dherukerehaa; dhigurehaa; dhigelaabadhuvaa; bodurehaa-afb94; boduhuttaa-90cb4; kannigillaa; koderataa; kodedhoo; kanandhuvaa; kodahutigalaa; keramihthaa; keleihuttaa; kodaanahutta; keyhuvadhoo; kalhehuttaa-c1e89; kalhahigillaa; kaalhehuttaa-5f435; rodaadhoo; kaashihulhudhoo; vilingillaa; hulhuvaarulaa; kaalhehuttaa; hunigondirehaa; hoothodeyaa; hevaahulhudhoo; gosi; kodegalaa; kadevaarehaa; bandefodiyaa; thinehuttaa; vatavarrehaa; ukurihuttaa; thelehuttaa; rodhavarrehaa; bodehineaa; uhehuttaa; bolimathaidhoo; haadhuvaa; maanaidhoo; raabadaafehirataa; kudhehaadhuvaa; dhathaidhuaa; kudhemaanaidhuvaa; ekerukaarataa; faahuttaa; dhoanigillaa; aakiraahuttaa; dhoonirehaa-c2e1b; hiyanigilihuttaa; handahuttaa; maadhuaa; oinigillaa; athihuttaa; kudhebeeraahuttaa; bondebeeraahuttaa; haveyyerataa; kudhe-ehivakaa; kurikeymaahuttaa; faanahuttaa; filaarataa; maarehaa-77902; kandahdhoo; raaverinkolhihuttaa; havvayyarataa; handaidhoo; hakandoo; kudhemathaidhoo; dhiyanigili; fatefandhoo; dhatemulhaidhoo; farahalahuttaa; kaafarataa; kandhefala; neimaahutta; keredhirehaa; bodemulhaidhoo; kadelerataa; lifadhoo; kudhelifadhoo-81a19; fereythaviligillaa; kurehdhoo-21735; dhatekekerenehuttaa; uhurehaa; dhinmanaa; faredhoo; kudherataa; kudhehulhehdhoo; maarehaa-4ccbf; kudhelifadhoo; fonehigillaa; maallaarehaa; mathaidhoo; mathikeranahuttaa; meehinethiyenehuttaa; olhurataa; olhimuntaa; vaireyaadhuvaa; merangihuttaa; veraaviligillaa; meyragillaa; ulegalaa; menthandhuvaa; rahadhuvaa; odagallaa-2c744; mudhimaahutta; mathihuttaa; maguhdhuvaa; maavahdhuva; maavaarulu; maagonderehaa; maagalaa; lonudhoohuttaa; lonudhoo; laihaa; kalherehaa; kalhehamalaa; kafena; havodigalaa; kandahalagalaa; golhaallaa; kaashidhoo-8e119; havoddaa; farehulhedhoo; gazeeraa; gan-0e6b4; baulhagallaa; dhoonirehaa; kaadehdhoo; konottaa; faresmaathodaa; thinadhoo-96422; fiyoari; gahdhoo; vaadhoo-9fe04; rathafandhoo; madaveli; nadellaa; hoandehdhoo'
WHERE slug = 'gaafu-dhaalu';

UPDATE locations 
SET island_reference = 'velifinolhu; vangaaru; umuraifinolhu; mulidhoo; naridhoo; matheerah; medhafushi; madulu; manafaru; maafinolhu; kudafinolhu; govvaafushi; innafinolhu; gallandhoo; gaamathikulhudhoo; gaafushi; dhigufaruhuraa; dhapparuhuraa; beenaafushi; dhonakulhi; huvahandhoo; alidhoo; maafahi; baarah; utheemu; muraidhoo; thakandhoo; filladhoo; maarandhoo; dhihdhoo; vashafaru; molhadhoo; hathifushi; kelaa; ihavandhoo; berinmadhoo; hoarafushi; uligamu; thuraakunu; alidhuffarufinolhu; maarandhoofarufinolhu; ungulifinolhu; kandaalifinolhu'
WHERE slug = 'haa-alifu';

UPDATE locations 
SET island_reference = 'veligandu; ruffushi; naagoashi; keylakunu; kudamuraidhoo; muiri; kattalafushi; kanamana; hondaafushi; hirinaidhoo; fenboahuraa; innafushi; dhipparufushi; theefaridhoo; vaikaramuraidhoo; makunudhoo; neykurendhoo; maavaidhoo; vaikaradhoo; kudafarufasgandu; kumundhoo; kuredhigandu; nellaidhoo; nolhivaram; kunburudhoo; kurinbi; nolhivaranfaru; naivaadhoo; hirimaradhoo; faridhoo; hondaidhoo; hanimaadhoo; finey'
WHERE slug = 'haa-dhaalu';

UPDATE locations 
SET island_reference = 'vammaafushi; vilingilimathidhahuraa; vabboahuraa; vaagali; thanburudhoo-2243b; rasfari; olhuhali; maniyafushi; olhigandufinolhu; madivaru-de0b6; kudafinolhu-6ea00; maadhoo; erruh-huraa; kagi; boduhuraa-34318; villivaru; vabbinfaru; enboodhoofinolhu; henbadhoo-01df5; vaadhoo-cd5fd; thulhaagiri; kanuoiyhuraa; olhuveli; ziyaaraiyfushi; mahaanaelhihuraa; veliganduhuraa; medhufinolhu; lankanfinolhu; nakaiychaafushi; meerufenfushi; lhohifushi; makunudhoo-f3209; kudahithi; velassaru; vihamanaafushi; kanifinolhu; kandoomaafushi; helengeli; ihuru; lankanfushi; giraavaru-01e78; bodufinolhu-1c3b1; furanafushi; kudahuraa; fihaalhohi; eriadhoo-3b42b; enboodhoo-cd876; makunufushi; dhigufinolhu; rannaalhi; baros; farukolhufushi; boduhithi; bolifushi; asdhoo; biyaadhoo; feydhoofinolhu; girifushi; funadhoo-kaafu; dhoonidhoo; aarah-32812; kudabandos; thilafushi; kanduoiygiri; maifalhuhuraa; kohdhipparu; lhosfushi; bulhifushi; bodubis; dhonfushi; nakahchaahuraa; tholhimaraahuraa; ithaafinolhu; sifavaru; udhafinolhu; kudagiri; maaranfushi; bolidhuhfaru; the-crossroads-maldives; gulhifalhu; ithaafushi; kohdhipparu-finolhu; thulusdhoo-irumathee-huraagandu; kalhuhuraa; gulhigaathuhuraa; gaagandu; gasfinolhu; huraa; thunbafushi; guraidhoo; gulhi; maafushi; hinmafushi; thulusdhoo; gaafaru; dhiffushi-d84d0; kaashidhoo; akirifushi; bodubandos; male; hulhumaale; male-city-vilingili'
WHERE slug = 'kaafu';

UPDATE locations 
SET island_reference = 'kulhudhuffushi'
WHERE slug = 'kulhudhuffushi-city';

UPDATE locations 
SET island_reference = 'aarahaa; bodumahigulhi; enberahaa; bodufinolhu-cc55c; bodumungnafushi; kudamahigulhi; dhekunuvinagandu; rahaa; kalhaidhoo; kudarah-fa7f1; kokurahaa; kuredhirehaa; kudamungnafushi; veligandufinolhu; uthuruvinagandu; thunburi; thathunrahaa; vadinolhu; uvadhevifushi; olhutholhu; mendhoo-e229e; olhuveli-9c149; kudaveshi; medhuvinagandu; mahakanfushi; maaveshi; maafushi-9cdb0; maakalhuveli; kudafushi-7b32b; kudamaabulhali; kashidhoo-aaa12; kudafares; kudafenrehaa; kanuhuraa-b50b4; kandaru; kalhurahaa; hulhiyandhoo; hulhisdhoo; hendha; hikandhirahaa; holhurahaa; hanhushi; haiythoshi; guraidhoo-6ef7f; gasgandufinolhu; fushi-de2ad; fonagaadhoo; fenboarahaa; fares-bca1a; fenboahuraa-65b97; dhonberahaa; burrahaa; boduhuraa-f9728; bodumaabulhali; boduhuraa-841d5; bokaiyfushi; bodufinolhu-e8301; bodufenrahaa; athahendhu; kadhdhoo; maandhoo; kunahandhoo; baresdhoo; hulhimendhoo; gaadhoo; hithadhoo-f0c0d; maamendhoo; mundoo; fonadhoo; maavah; gan-147fa; kalaidhoo-e287b; maabaidhoo; isdhoo; dhanbidhoo'
WHERE slug = 'laamu';

UPDATE locations 
SET island_reference = 'dhirunbaahuraa; faadhoohuraagandu; boamandhipparu-huraagandu; bodufaahuraa; dhiffushi; hiriyadhoo; dhehuraa-evvihuraa; rathuruhhuraa; sehlhifushi; kudadhoo-21bd4; masleggihuraa; vihafarufinolhu-6cff5; veligandu-e165a; veyvah-a52e3; thilamaafushi; vavvaru; varihuraa; ookolhufinolhu; meyyafushi; medhahadihuraa; medhafushi-74f1e; medha-adihuraa; maidhoo; maduvvari-e6176; madivaru; maabinhuraa; lhossalafushi; maakoa; lhohi-a3a8c; kalhumanjehuraa; kanifushi; innahuraa; huravalhi; fushifaru-b055f; gaaerifaru; govvaafushi-911b1; hudhufushi; fehigili; fainuaadhanuhuraa; dheruffinolhu; faadhoo; dhihdhoo-a9e9e; dhashugirifinolhu; bodufinolhu-dbad2; aligau; madhiriguraidhoo; maafilaafushi; kurehdhoo-9e151; komandoo-b63e0; kanuhuraa; felivaru-6ebcb; olhuvelifushi; kurendhoo; naifaru; hinnavaru'
WHERE slug = 'lhaviyani';

UPDATE locations 
SET island_reference = 'male; hulhumale; male-city-vilingili'
WHERE slug = 'male-city';

UPDATE locations 
SET island_reference = 'uthuruboduveli; thuvaru; seedheehuraa; seedheehuraaveligandu; kudausfushi; maalhaveli; maahuraa; maausfushi; kekuraalhuveli; hurasveli; gasveli; gongalihuraa; gaakurali; fenfuraaveli; erruhhuraa; dhihthundi; boahuraa; dhekunuboduveli; medhufushi; maduvvari-1d6f0; hakuraahuraa; dhiggaru; kolhufushi; naalaafushi; veyvah-ffc11; mulah; madifushi; muli; kakaahuraa; raiymandhoo; etherefasgandu; thuvaru-uthuruhuraa; bodukanduhuraa; vannanerufasgandu; uthurugaseveli; raabandhihuraa; kuradhigandu; hudhuveli'
WHERE slug = 'meemu';

UPDATE locations 
SET island_reference = 'vihafarufinolhu; vavathi; thanburudhuffushi; thoshigandukolhu; thanburudhoo; randheli; raalhulaakolhu; raafushi; orivaru; orivarukudarah; orimasvaru; minaavaru; maavahdhoo; medhufaru; maafunafaru; maavelavaru; medhafushi-49112; maakanaafushi; kuredhivaru; kunnamalei; kuramaadhoo; loafaru; kedhivaru; kudafushi; kudafunafaru; karinmavattaru; karinma; kandinmaahuraa; kafakomandoo; kalaidhoo; kaalhugemendhoo; inguraidhoo; fushivelavaru; hulhuhdhoo; huvandhumaavattaru; goanbilivaadhoo; huivani; holhumeedhoo; felivaru; fohdhipparu; farumuli; ekulhivaru; ehdhuffarumairah; dhonaerikandoodhoo; dhigurah-a5ba1; dhekenanfaru; burehifasdhoo; bomasdhoo; dheefuram; bodulhaimendhoo; velidhoo; bandaidhihdhoo; bodufushi; fohdhoo; holhudhoo; manadhoo; magoodhoo; maafaru; miladhoo; lhohi; landhoo; kudafari; maalhendhoo; tholhendhoo; kendhikulhudhoo; maakurehdhoo; henbadhoo; felivarukudarah; dhelibeyruhelhihuraa'
WHERE slug = 'noonu';

UPDATE locations 
SET island_reference = 'goboshi; gemana; vakkarufaru; minaadhoo; kukulhudhuffaru; boduhaiykodi; orimasfushi; raa-vilingili; vandhoo; veyvah; vaffushi; vaffushihuraa; uthurumaafaru; ungulu; thaavathaa; neyo-c2c94; ufulandhoo; muravandhoo; mullaafushi; mahidhoo; maanenfushi; maamunagaufinolhu; madivaafaru; maashigiri; maamunagau; maamingili; linboakandhoo; lundhufushi; lhohi-b692b; lhaanbugali; kurehdhoo; kuroshigiri; kukulhudhoo; kudathulhaadhoo; kudalhosgiri; kudakurathu; kudafushi-3e53b; kudafenmaaenboodhoo; kothaifaru; kottefaru; kandoogandu; hiraveri; hiboodhoo; goyyafaru; giraavaru; goiymaru; fuggiri; filaidhoo; furaveri; fenfushi; fasmendhoo; fasgandufaru; faarufushi; dhoragali; dhuvaafaruhuraa; ehthigili; ethigandu-jehihuraa; dhuvaafaru; dhinnaafushi; dhikkurehdhoo; dhigali; dhekunumaafarufinolhu; bandaveri; dheburidheythereyvaadhoo; boduhuraa-8927e; bodufushi-24f1f; bodufenmaaenboodhoo; bodufarufinolhu; arilundhoo; angaagiri; aarah; meedhupparu; ifuru; kinolhas; hulhudhuffaaru; meedhoo-fbcaa; inguraidhoo-edac2; fainu; maduvvari; innamaadhoo; rasmaadhoo; maakurathu; ungoofaaru; kandholhudhoo; gaaundoodhoo; angolhitheemu; vaadhoo; rasgetheemu; alifushi'
WHERE slug = 'raa';

UPDATE locations 
SET island_reference = 'vangaru; gonaafarufinolhu; ragganduhuraa; naainfarufinolhu; dhiguvelidhoomairah; neyo; naalaahuraa; nalandhoo; narurinbudhoo; migoodhoo; medhurah; medhukunburudhoo; mathikomandoo; madikuredhdhoo; kudalhaimendhoo; madidhoo; kakaaeriyadhoo; kudafarufinolhu; kudadhoo; gallaidhoo; kanbaalifaru; hirubadhoo; hurasfaru; gaakoshibi; fushifaru; farukolhu; dhonvelihuraa; ekasdhoo; eriadhoo; dholhiyadhookudarah; dholhiyadhoo; dhigurah; bolissafaru; boduhuraa; bis-alhaahuraa; keekimini; milandhoo; maaungoodhoo; firunbaidhoo; komandoo; funadhoo-shaviyani; lhaimagu; maroshi; maakandoodhoo; narudhoo; foakaidhoo; feydhoo-f628c; feevah; noomaraa; bileiyfahi; goidhoo; kanditheemu'
WHERE slug = 'shaviyani';

UPDATE locations 
SET island_reference = 'rihaamaafushi; vanbadhi; usfushi; ufuriyaa; ruhthibirah; olhudhiyafushi; olhufushifinolhu; olhugiri-c4245; olhufushi-27492; medhafushi-b14da; mathidhoo; maalefushi; maagulhi; lhavaddoo; kurandhuvaru; kuredhifushi; kudakinbidhoo; kolhufushi-ad19d; kudakaaddoo; kudadhoo-034d9; kolafushi; kalhufahalafushi; kani; kakolhas; kalhudheyfushi; kafidhoo; hondelifushi; kandufushi; hulhiyanfushi; kaaddoo; hikandhilhohi; hiriyanfushi; hathifushi-ee44c; gaalee; gaathurehaa; fushi-bd091; funaddu; fonidhaani; fenmeerufushi; fenfushi-b706b; elaa; dhururehaa; ekuruffushi; dhonanfushi; dhiffushi-a0d1d; bodufinolhu-875f4; bodurehaa; kanimeedhoo; fondhoo; omadhoo-18730; veymandoo; kinbidhoo; gaadhiffushi; vandhoo-2e44a; thimarafushi; hirilandhoo; kandoodhoo; guraidhoo-1efed; dhiyamigili; madifushi-ac9cd; vilufushi; burunee'
WHERE slug = 'thaa';

UPDATE locations 
SET island_reference = 'hingaakulheefinolhu; kuda-anbaraa; hurahufinolhu; rahgandu; vattaru; vashugiri; thunduhuraa; hulhidhoo; kudhiboli; ruhhurihuraa; aarah-0fbb8; fohtheyobodufushi; dhiggiri-9035f; alimathaa; bodumohoraa; keyodhoo-b6a7c; anbaraa; rakeedhoo; felidhoo; thinadhoo; fulidhoo'
WHERE slug = 'vaavu';