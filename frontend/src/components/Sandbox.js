"use client";

import React, { useState, useRef } from "react";
import {
  Heart, Home, TreePine, Sun, Moon, Star, Flower,
  Car, Plane, Ship, Dog, Cat, Bird, Fish,
  Crown, Shield, Book, Music, Camera, Gift,
  Baby, Users, MapPin, Mountain, Waves, Cloud, Rainbow
} from "lucide-react";

/* ----------------------------- 渲染组件 ----------------------------- */
const RenderAsset = ({ item, size = 40 }) => {
  // ↑ size 传 32 用于侧栏，40 用于沙盘
  if (item.model) {
    /** 如果未来要渲染 GLB，可在此处换成 react-three/fiber + useGLTF **/
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center bg-gray-200 text-xs text-gray-600 select-none"
      >3D</div>
    );
  }
  if (item.img) {
    return (
      <img
        src={item.img}
        alt={item.name}
        width={size}
        height={size}
        className="object-contain pointer-events-none drop-shadow-lg"
      />
    );
  }
  const Icon = item.icon;
  return (
    <Icon
      className={`pointer-events-none drop-shadow-lg ${item.color}`}
      style={{ width: size, height: size }}
    />
  );
};

/* -------------------------- 主沙盘组件 -------------------------- */
const SandplayTherapy = () => {
  /* 状态 */
  const [placed, setPlaced] = useState([]);
  const [selectedCat, setSelectedCat] = useState("人物");
  const [dragGhost, setDragGhost] = useState(false);   // 拖拽高亮
  const [dragged, setDragged] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const box = useRef(null);

  /* 物品库：icon | img | model 三选一，后两者准备好后替换即可 */
  const lib = {
    人物: [
      { id: "family",  icon: Users,  img: "", model: "", name: "家庭",  color: "text-blue-600" },
      { id: "baby",    icon: Baby,   img: "", model: "", name: "婴儿",  color: "text-pink-400" },
      { id: "self",    icon: Heart,  img: "", model: "", name: "自己",  color: "text-red-500" },
    ],
    建筑: [
      { id: "house",   icon: Home,   img: "", model: "", name: "房屋",  color: "text-amber-600" },
      { id: "castle",  icon: Crown,  img: "", model: "", name: "城堡",  color: "text-purple-600" },
      { id: "school",  icon: Book,   img: "", model: "", name: "学校",  color: "text-blue-500" },
    ],
    自然: [
      { id: "tree",  icon: TreePine,  img: "", model: "", name: "树木",  color: "text-green-600" },
      { id: "mountain", icon: Mountain, img: "", model: "", name: "山峰", color: "text-gray-600" },
      { id: "waves", icon: Waves, img: "", model: "", name: "海浪", color: "text-cyan-500" },
      { id: "flower", icon: Flower, img: "", model: "", name: "花朵", color: "text-pink-500" },
      { id: "sun", icon: Sun, img: "", model: "", name: "太阳", color: "text-yellow-500" },
      { id: "moon", icon: Moon, img: "", model: "", name: "月亮", color: "text-indigo-400" },
      { id: "star", icon: Star, img: "", model: "", name: "星星", color: "text-yellow-400" },
      { id: "cloud", icon: Cloud, img: "", model: "", name: "云朵", color: "text-gray-400" },
      { id: "rainbow", icon: Rainbow, img: "", model: "", name: "彩虹", color: "text-purple-500" },
    ],
    动物: [
      { id: "dog", icon: Dog, img: "", model: "", name: "小狗", color: "text-amber-700" },
      { id: "cat", icon: Cat, img: "", model: "", name: "小猫", color: "text-gray-600" },
      { id: "bird", icon: Bird, img: "", model: "", name: "鸟儿", color: "text-blue-400" },
      { id: "fish", icon: Fish, img: "", model: "", name: "鱼儿", color: "text-cyan-600" },
    ],
    交通: [
      { id: "car", icon: Car, img: "", model: "", name: "汽车", color: "text-red-600" },
      { id: "plane", icon: Plane, img: "", model: "", name: "飞机", color: "text-blue-600" },
      { id: "ship", icon: Ship, img: "", model: "", name: "船只", color: "text-cyan-700" },
    ],
    物品: [
      { id: "shield", icon: Shield, img: "", model: "", name: "盾牌", color: "text-gray-700" },
      { id: "music", icon: Music, img: "", model: "", name: "音乐", color: "text-purple-500" },
      { id: "camera", icon: Camera, img: "", model: "", name: "相机", color: "text-gray-800" },
      { id: "gift", icon: Gift, img: "", model: "", name: "礼物", color: "text-red-500" },
      { id: "location", icon: MapPin, img: "", model: "", name: "地点", color: "text-red-400" },
    ],
  };

  /* 侧栏拖出 */
  const handleDragStart = (e, item) => {
    setDragGhost(true);
    e.dataTransfer.setData("json", JSON.stringify(item));
  };
  const handleDragEnd = () => setDragGhost(false);

  /* 放到沙盘 */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragGhost(false);
    const data = JSON.parse(e.dataTransfer.getData("json"));
    const rect = box.current.getBoundingClientRect();
    setPlaced(arr => ([
      ...arr,
      {
        ...data,
        x: e.clientX - rect.left - 20,
        y: e.clientY - rect.top - 20,
        id: `${data.id}-${Date.now()}`
      },
    ]));
  };
  const allowDrop = (e) => e.preventDefault();

  /* 沙盘内再次拖动 */
  const beginMove = (e, item) => {
    e.stopPropagation();
    const rect = box.current.getBoundingClientRect();
    setDragged(item);
    setOffset({ x: e.clientX - rect.left - item.x, y: e.clientY - rect.top - item.y });
  };
  const move = (e) => {
    if (!dragged) return;
    const rect = box.current.getBoundingClientRect();
    const nx = e.clientX - rect.left - offset.x;
    const ny = e.clientY - rect.top - offset.y;
    const maxX = rect.width - 40;
    const maxY = rect.height - 40;
    setPlaced(p => p.map(it => it.id === dragged.id ? { ...it, x: Math.max(0, Math.min(nx, maxX)), y: Math.max(0, Math.min(ny, maxY)) } : it));
  };
  const endMove = () => setDragged(null);

  /* 其他操作 */
  const remove = (id) => setPlaced(p => p.filter(it => it.id !== id));
  const clear  = () => setPlaced([]);
  const save   = () => {
    const blob = new Blob([JSON.stringify(placed, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "沙盘场景.json"; a.click();
    URL.revokeObjectURL(url);
  };

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-amber-800 mb-2">心理沙盘游戏</h1>
          <p className="text-amber-600">拖拽物品表达内心世界，素材就绪后可自动替换图片 / 3D 模型</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧栏 */}
          <aside className="bg-white rounded-xl shadow-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">物品选择</h2>
            {/* 分类 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(lib).map(cat => (
                <button key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1 rounded-full text-sm ${selectedCat === cat ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                  {cat}
                </button>
              ))}
            </div>
            {/* 列表 */}
            <div className="grid grid-cols-3 gap-3">
              {lib[selectedCat].map(item => (
                <div key={item.id} draggable onDragStart={e => handleDragStart(e, item)} onDragEnd={handleDragEnd}
                  className="flex flex-col items-center p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 border-2 border-transparent hover:border-amber-300">
                  <RenderAsset item={item} size={32} />
                  <span className="text-xs text-gray-600 mt-1 text-center">{item.name}</span>
                </div>
              ))}
            </div>
            {/* 操作 */}
            <div className="mt-6 space-y-2">
              <button onClick={clear} className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">清空沙盘</button>
              <button onClick={save}  className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">保存场景</button>
            </div>
          </aside>

          {/* 沙盘 */}
          <section className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">你的沙盘世界</h2>
              <div ref={box}
                className={`relative w-full h-[640px] rounded-lg border-4 overflow-hidden border-amber-300 bg-gradient-to-b from-sky-200 via-amber-100 to-amber-200 ${dragGhost ? "ring-4 ring-amber-400 ring-offset-2" : ""}`}
                onDrop={handleDrop} onDragOver={allowDrop}
                onMouseMove={move} onMouseUp={endMove} onMouseLeave={endMove}>
                {/* 放置物品 */}
                {placed.map(it => (
                  <div key={it.id}
                    style={{ left: it.x, top: it.y }}
                    className="absolute group select-none"
                    onMouseDown={e => beginMove(e, it)} onDoubleClick={() => remove(it.id)}>
                    <RenderAsset item={it} size={40} />
                    <button onClick={() => remove(it.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 hover:bg-red-600 flex items-center justify-center">×</button>
                  </div>
                ))}

                {placed.length === 0 && !dragGhost && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-amber-600 opacity-60 text-lg">拖拽物品到此处开始创作</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SandplayTherapy;
