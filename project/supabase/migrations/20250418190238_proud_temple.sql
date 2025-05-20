/*
  # Add remaining location tags

  1. Changes
    - Add remaining location tags for all atolls and cities
    - Each tag includes:
      - Name in Thaana and English
      - Slug
      - Collection and item IDs
      - Island references
      - Flag SVG URL
      - Positioning data

  2. Security
    - Uses existing RLS policies
*/

INSERT INTO location_tags (
  name, name_en, slug, collection_id, item_id,
  island_reference, flag, url, width, margin_top
)
VALUES
  ('ބ. އަތޮޅު', 'Baa', 'baa', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b04248',
   'thiladhoo; vinaneiyfaruhuraa; veyofushi; voavah; vakkaru; ufuligiri; nibiligaa; nelivarufinolhu; olhugiri; muthaafushi; mudhdhoo; miriandhoo; medhufinolhugaathufinolhu; milaidhoo; mendhoo; maarikilu; madhirivaadhoo; maamaduvvari; maaddoohulhudhoo; kihavahhuravalhi; kudadhoo-395be; keyodhoo; kashidhuffarufinolhu; kanufusheegaathufinolhu; kanufushi; kashidhoo; innafushi-0a547; hulhudhoo-dcd52; hirundhoo; hibalhidhoo; hanifaru; gemendhoo; gaagandufaruhuraa; gaavilingili; fares; finolhas; enboodhoo; dhoogandufinolhu; dhigufaruvinagandu; dhigudhefaru; dhandhoo; bathalaa; bodufinolhu; boifushi; dhakandhoo; boadhaafushifinolhu; anhenunfushi; aidhoo; ahivaffushi; horubadhoo; kunfunadhoo; dhunikolhu; landaagiraavaru; kihaadhuffaru; fonimagoodhoo; goidhoo-18b26; fehendhoo; fulhadhoo; funadhoo-baa; hithaadhoo-baa; thulhaadhoo; eydhafushi; maalhos; dharavandhoo; dhonfanu; kihaadhoo; undoodhoo; maaddoo; kendhoo; bathalaahuraa; kudarikilu; finolhufaru; kamadhoo; angaafaru; dhashufaruhuraa; vandhuhmaafarufinolhu; maafusheefinolhu; mathifaru; velavaru; huraafaru; dhigufaru; hanifaruhuraa',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6661a413b73db6f7ed5af2e0_baa.svg',
   NULL,
   'width: 7.6em',
   'margin-top: 3.3em; margin-left: 69.6em'),

  ('ދ. އަތޮޅު', 'Dhaalu', 'dhaalu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b04262',
   'vommuli; uhdhoo; thinhuraa; thanbalhaidhoo; olhufushi; thilabolhufushi; olhuveli-14521; minimasgali-d7860; maalefaru; maagau-371fa; maafushi-da938; maadheli; kedhigandu; kiraidhoo; kanneiyfaru; hulhuvahi; issari; hudhufusheefinolhu; hiriyafushi; dhebaidhoo; fenfushi-b8d0b; enboodhoofushi; dhoores; faandhoo; ayyakaloahuraa; lhohi-e19c6; aluvifushi; bulhalafushi; meedhuffushi; velavaru-7ad19; kudahuvadhoo; maaenboodhoo; vaanee; gemendhoo-91f7d; bandidhoo; hulhudheli; rinbudhoo; meedhoo-a4355; hinaidhoo; kudathilabolhufushi; sarakafushi; boarikifinolhu; vallalhohi; bodufushi-01836; kandinmaa; valla',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6661a5ecef363ecd6e6b2b6c_dhaalu_1.svg',
   'http://habaru.webflow.io/atolls/dhaalu',
   'width: 5.1em',
   'margin-top: 3.9em; margin-left: 43.1em'),

  ('ފ. އަތޮޅު', 'Faafu', 'faafu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b0414e',
   'dhiguvarufinolhu; magoodhoobodufinolhu; vilingilivarufinolhu; makunueri; minimasgali; madivaruhuraa; kandumoonufushi; jinnathugau; himithi; enbulufushi; faanumaahuraa; adhangau; filitheyo; maafushi-35cae; nilandhoo; dharanboodhoo; feeali; magoodhoo-0a50d; bileiydhoo',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/63adddd455eda79fea2f2b25_Faafu.svg',
   'http://habaru.webflow.io/atolls/faafu',
   'width: 3.9em',
   'margin-top: 3.7em; margin-left: 48em'),

  ('ގއ. އަތޮޅު', 'Gaafu Alifu', 'gaafu-alifu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b04263',
   'vodamulaa; odagallaa; viligalaa; meradhoo; minimessaa; medharehaa; mahahdhoo; medhehuttaa; maarehaa; maamutaa; maarandhoo-386e5; mahthidhoo; maagihuttaa; maafehelaa; maadhigavara; lhossaa; kudalafari; kodahuttaa; kodeyvilingili; kondeymatheelaabadhoo; kisserahaa; kalhehuttaa; innarehaa; kanduvilingili; hurendhoo; idhimaa; hulhimendhoo-e83e4; hithaadhoogalaa; hinaamaagalaa; handahaa; funamauddaa; funadhooviligillaa; funadhoo-gaafu-alifu; falhumaafushi; fulangi; faruhulhudhoo; fenrehaa; dhigudhoo; dhigurah-f0be0; dhevvalaabadhoo; dhevvaamaagalaa; bodehuttaa; beyrumauddoo; bodubondeyyaa; bakehthaa; baaberehutta; baavanadhoo; gemanafushi; araigahthaa; kendheraa; kooddoo; kanduhulhudhoo; kondey; dhiyadhoo; dhevvadhoo; dhaandhoo; nilandhoo-234dd; maamendhoo-b1107; kolamaafushi; vilingili-23a20',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6674045dab2d2060e5a51b9f_gaafu-alif.svg',
   'http://habaru.webflow.io/atolls/gaafu-alifu',
   'width: 7.6em',
   'margin-top: 7em; margin-left: 14.1em'),

  ('ގދ. އަތޮޅު', 'Gaafu Dhaalu', 'gaafu-dhaalu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b04255',
   'bodehuttaa-3b991; bodehutta; femunaidhoo; gahevelagalaa; fenevenhuttaa; farukolhuhuttaa; ekelondaa; dhoonirehaa-62cb3; ehivakaa; dherukerehaa; dhigurehaa; dhigelaabadhuvaa; bodurehaa-afb94; boduhuttaa-90cb4; kannigillaa; koderataa; kodedhoo; kanandhuvaa; kodahutigalaa; keramihthaa; keleihuttaa; kodaanahutta; keyhuvadhoo; kalhehuttaa-c1e89; kalhahigillaa; kaalhehuttaa-5f435; rodaadhoo; kaashihulhudhoo; vilingillaa; hulhuvaarulaa; kaalhehuttaa; hunigondirehaa; hoothodeyaa; hevaahulhudhoo; gosi; kodegalaa; kadevaarehaa; bandefodiyaa; thinehuttaa; vatavarrehaa; ukurihuttaa; thelehuttaa; rodhavarrehaa; bodehineaa; uhehuttaa; bolimathaidhoo; haadhuvaa; maanaidhoo; raabadaafehirataa; kudhehaadhuvaa; dhathaidhuaa; kudhemaanaidhuvaa; ekerukaarataa; faahuttaa; dhoanigillaa; aakiraahuttaa',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/666bbaef223033443b27e291_gaafu-dhaal.svg',
   'http://habaru.webflow.io/atolls/gaafu-dhaalu',
   'width: 6.1em',
   'margin-top: 5.2em; margin-left: 11.4em'),

  ('ހއ. އަތޮޅު', 'Haa Alifu', 'haa-alifu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b0424b',
   'velifinolhu; vangaaru; umuraifinolhu; mulidhoo; naridhoo; matheerah; medhafushi; madulu; manafaru; maafinolhu; kudafinolhu; govvaafushi; innafinolhu; gallandhoo; gaamathikulhudhoo; gaafushi; dhigufaruhuraa; dhapparuhuraa; beenaafushi; dhonakulhi; huvahandhoo; alidhoo; maafahi; baarah; utheemu; muraidhoo; thakandhoo; filladhoo; maarandhoo; dhihdhoo; vashafaru; molhadhoo; hathifushi; kelaa; ihavandhoo; berinmadhoo; hoarafushi; uligamu; thuraakunu',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6684525749bc916c71561e7a_alif-alif.svg',
   NULL,
   'width: 4em',
   'margin-top: 3.1em; margin-left: 95.9em'),

  ('ހދ. އަތޮޅު', 'Haa Dhaalu', 'haa-dhaalu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b04245',
   'veligandu; ruffushi; naagoashi; keylakunu; kudamuraidhoo; muiri; kattalafushi; kanamana; hondaafushi; hirinaidhoo; fenboahuraa; innafushi; dhipparufushi; theefaridhoo; vaikaramuraidhoo; makunudhoo; neykurendhoo; maavaidhoo; vaikaradhoo; kudafarufasgandu; kumundhoo; kuredhigandu; nellaidhoo; nolhivaram; kunburudhoo; kurinbi; nolhivaranfaru; naivaadhoo; hirimaradhoo; faridhoo; hondaidhoo; hanimaadhoo; finey',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6661a4a5801b26c8e54295bb_haa-dhaal.svg',
   NULL,
   'width: 8.1em',
   'margin-top: 0.1em; margin-left: 87.8em'),

  ('ކ. އަތޮޅު', 'Kaafu', 'kaafu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b04186',
   'vammaafushi; vilingilimathidhahuraa; vabboahuraa; vaagali; thanburudhoo-2243b; rasfari; olhuhali; maniyafushi; olhigandufinolhu; madivaru-de0b6; kudafinolhu-6ea00; maadhoo; erruh-huraa; kagi; boduhuraa-34318; villivaru; vabbinfaru; enboodhoofinolhu; henbadhoo-01df5; vaadhoo-cd5fd; thulhaagiri; kanuoiyhuraa; olhuveli; ziyaaraiyfushi; mahaanaelhihuraa; veliganduhuraa; medhufinolhu; lankanfinolhu; nakaiychaafushi; meerufenfushi; lhohifushi; makunudhoo-f3209; kudahithi; velassaru; vihamanaafushi; kanifinolhu; kandoomaafushi; helengeli; ihuru; lankanfushi; giraavaru-01e78',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6661a4e502f4ed0c53837172_kaaf.svg',
   NULL,
   'width: 15.1em',
   'margin-top: 10.1em; margin-left: 57em'),

  ('ޅ. އަތޮޅު', 'Lhaviyani', 'lhaviyani', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b040b3',
   'dhirunbaahuraa; faadhoohuraagandu; boamandhipparu-huraagandu; bodufaahuraa; dhiffushi; hiriyadhoo; dhehuraa-evvihuraa; rathuruhhuraa; sehlhifushi; kudadhoo-21bd4; masleggihuraa; vihafarufinolhu-6cff5; veligandu-e165a; veyvah-a52e3; thilamaafushi; vavvaru; varihuraa; ookolhufinolhu; meyyafushi; medhahadihuraa; medhafushi-74f1e; medha-adihuraa; maidhoo; maduvvari-e6176; madivaru; maabinhuraa; lhossalafushi; maakoa; lhohi-a3a8c',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/668454782ebfb4acd3a801bb_lhaviyani.svg',
   NULL,
   'width: 4.8em',
   'margin-top: 9.5em; margin-left: 75.4em'),

  ('މާލެ ސިޓީ', 'Male City', 'male-city', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b04166',
   'male; hulhumale; male-city-vilingili',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/66b27817c0bfdabb2bb608d7_kaaf.svg',
   NULL,
   'width: 15.1em',
   'margin-top: 10.1em; margin-left: 57em'),

  ('މ. އަތޮޅު', 'Meemu', 'meemu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b040ed',
   'uthuruboduveli; thuvaru; seedheehuraa; seedheehuraaveligandu; kudausfushi; maalhaveli; maahuraa; maausfushi; kekuraalhuveli; hurasveli; gasveli; gongalihuraa; gaakurali; fenfuraaveli; erruhhuraa; dhihthundi; boahuraa; dhekunuboduveli; medhufushi; maduvvari-1d6f0; hakuraahuraa; dhiggaru; kolhufushi; naalaafushi; veyvah-ffc11; mulah; madifushi; muli',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6661a5cd9f3a3e7d9a406f3e_meemu.svg',
   'http://habaru.webflow.io/atolls/meemu',
   'width: 5.9em',
   'margin-top: 10.5em; margin-left: 43.9em'),

  ('ނ. އަތޮޅު', 'Noonu', 'noonu', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b04244',
   'vihafarufinolhu; vavathi; thanburudhuffushi; thoshigandukolhu; thanburudhoo; randheli; raalhulaakolhu; raafushi; orivaru; orivarukudarah; orimasvaru; minaavaru; maavahdhoo; medhufaru; maafunafaru; maavelavaru; medhafushi-49112; maakanaafushi; kuredhivaru; kunnamalei; kuramaadhoo; loafaru; kedhivaru; kudafushi; kudafunafaru; karinmavattaru; karinma; kandinmaahuraa; kafakomandoo; kalaidhoo',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6661a542c1305683c47adde5_noonu.svg',
   NULL,
   'width: 5em',
   'margin-top: 7.2em; margin-left: 80.8em'),

  ('ރ. އަތޮޅު', 'Raa', 'raa', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b040cd',
   'goboshi; gemana; vakkarufaru; minaadhoo; kukulhudhuffaru; boduhaiykodi; orimasfushi; raa-vilingili; vandhoo; veyvah; vaffushi; vaffushihuraa; uthurumaafaru; ungulu; thaavathaa; neyo-c2c94; ufulandhoo; muravandhoo; mullaafushi; mahidhoo; maanenfushi; maamunagaufinolhu; madivaafaru; maashigiri; maamunagau; maamingili; linboakandhoo; lundhufushi; lhohi-b692b; lhaanbugali',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6661a596870179d8bdd031cf_raa.svg',
   NULL,
   'width: 9.3em',
   'margin-top: 2.7em; margin-left: 76.6em'),

  ('ށ. އަތޮޅު', 'Shaviyani', 'shaviyani', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b0424a',
   'vangaru; gonaafarufinolhu; ragganduhuraa; naainfarufinolhu; dhiguvelidhoomairah; neyo; naalaahuraa; nalandhoo; narurinbudhoo; migoodhoo; medhurah; medhukunburudhoo; mathikomandoo; madikuredhdhoo; kudalhaimendhoo; madidhoo; kakaaeriyadhoo; kudafarufinolhu; kudadhoo; gallaidhoo; kanbaalifaru; hirubadhoo; hurasfaru; gaakoshibi; fushifaru; farukolhu',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/6661a52ef27df3e99172b09f_shaviyani.svg',
   NULL,
   'width: 6.4em',
   'margin-top: 4em; margin-left: 85.1em'),

  ('ތ. އަތޮޅު', 'Thaa', 'thaa', '657ec63a7aaf05e4e6b0412d', '657ec63a7aaf05e4e6b04249',
   'rihaamaafushi; vanbadhi; usfushi; ufuriyaa; ruhthibirah; olhudhiyafushi; olhufushifinolhu; olhugiri-c4245; olhufushi-27492; medhafushi-b14da; mathidhoo; maalefushi; maagulhi; lhavaddoo; kurandhuvaru; kuredhifushi; kudakinbidhoo; kolhufushi-ad19d; kudakaaddoo; kudadhoo-034d9; kolafushi; kalhufahalafushi; kani; kakolhas; kalhudheyfushi; kafidhoo; hondelifushi; kandufushi',
   'https://uploads-ssl.webflow.com/6342fb304d9033d5e69ad68c/63adddbd8ce5f09a99ad3ccd_thaa.svg',
   'http://habaru.webflow.io/atolls/thaa',
   'width: 5.7em',
   'margin-top: 4.9em; margin-left: 36.6em')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  island_reference = EXCLUDED.island_reference,
  flag = EXCLUDED.flag,
  url = EXCLUDED.url,
  width = EXCLUDED.width,
  margin_top = EXCLUDED.margin_top;