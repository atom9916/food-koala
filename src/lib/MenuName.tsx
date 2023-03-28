// メニュー名が長い時は短く表示
function MenuName(menu: { name: string }) {
  const menuName = menu.name.slice(0, 8);
  if (menu.name.length > 8) {
    return <span>{menuName}...</span>;
  } else {
    return <span>{menu.name}</span>;
  }
}

export { MenuName };
