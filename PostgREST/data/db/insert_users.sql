INSERT INTO api.users (
    name,
    email,
    zipcode,
    address,
    phone_number,
    password
) VALUES(
    '高橋　祐香',
    'yuka.takahashi@rakus-partners.co.jp',
    '160-0022',
    '東京都新宿区新宿4-3-25',
    '0366753638',
    'yuka'
),
(
    '杉浦　早紀',
    'saki.sugiura@rakus-partners.co.jp',
    '160-0022',
    '東京都新宿区新宿4-3-25',
    '0366753638',
    'saki'
),
(
    '獅子堂　孝雄',
    'takao.shishido@rakus-partners.co.jp',
    '160-0022',
    '東京都新宿区新宿4-3-25',
    '0366753638',
    'takao'
),
(
    '中嶋　勇樹',
    'yuki.nakajima@rakus-partners.co.jp',
    '160-0022',
    '東京都新宿区新宿4-3-25',
    '0366753638',
    'yuki'
),
(
    '遠矢　学',
    'manabu.toya@rakus-partners.co.jp',
    '160-0022',
    '東京都新宿区新宿4-3-25',
    '0366753638',
    'manabu'
),
(
    '加藤　珠生',
    'tamaki.kato@rakus-partners.co.jp',
    '160-0022',
    '東京都新宿区新宿4-3-25',
    '0366753638',
    'tamaki'
),
(
    '佐藤　勇太',
    'yuta.sato@rakus-partners.co.jp',
    '160-0022',
    '東京都新宿区新宿4-3-25',
    '0366753638',
    'yuta'
),
(
    '坂本　真由',
    'mayu.sakamoto@rakus-partners.co.jp',
    '160-0022',
    '東京都新宿区新宿4-3-25',
    '0366753638',
    'mayu'
),
(
    '中川　瑞貴',
    'mizuki.nakagawa@rakus-partners.co.jp',
    '160-0022',
    '東京都新宿区新宿4-3-25',
    '0366753638',
    'mizuki'
),
(
    '小林　颯人',
    'hayato.kobayashi@rakus-partners.co.jp',
    '160-0022',
    '東京都新宿区新宿4-3-25',
    '0366753638',
    'hayato'
),
(
    '堀川　裕基',
    'hiroki.horikawa@rakus-partners.co.jp',
    '160-0022',
    '東京都新宿区新宿4-3-25',
    '0366753638',
    'hiroki'
);
SELECT * FROM api.users;

--@block
delete FROM api.users where id = 12;

SELECT * FROM api.users;
