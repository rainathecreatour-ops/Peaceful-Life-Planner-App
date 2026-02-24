import { useState, useEffect } from "react";

const VALID_LICENSE_KEYS = (import.meta.env.VITE_LICENSE_KEYS || "")
  .split(",").map(k => k.trim().toUpperCase()).filter(Boolean);

const STORAGE_KEY = "plp_data_v1";
const loadDb = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } };
const saveDb = (d) => localStorage.setItem(STORAGE_KEY, JSON.stringify(d));

const MOODS = ["🌸 Peaceful","🌤 Hopeful","😌 Calm","😔 Heavy","😤 Frustrated","🌪 Overwhelmed","🙏 Grateful"];
const EXPENSE_CATS = ["Housing","Food","Transport","Utilities","Health","Clothing","Entertainment","Faith/Giving","Self-care","Other"];
const todayStr = () => new Date().toISOString().slice(0,10);
const monthKey = (d) => d.slice(0,7);
const fmt = (n) => Number(n||0).toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
const toNum = (s) => parseFloat(String(s).replace(/[^0-9.]/g,""))||0;

const sections = [
  {id:"journal",icon:"📓",label:"Daily Journal"},
  {id:"vision",icon:"🌿",label:"Life Vision"},
  {id:"boundaries",icon:"🛡️",label:"Boundaries & Energy"},
  {id:"faith",icon:"✨",label:"Faith & Grounding"},
  {id:"relationships",icon:"💛",label:"Relationships"},
  {id:"financial",icon:"🌱",label:"Financial Calm"},
  {id:"health",icon:"🤍",label:"Health & Wellness"},
  {id:"experiences",icon:"🗺️",label:"Experiences & Travel"},
  {id:"memories",icon:"📖",label:"Memory Keeper"},
  {id:"reset",icon:"🌙",label:"Weekly Reset"},
  {id:"future",icon:"💌",label:"Future Self Letters"},
];

const sectionContent = {
  vision:{heading:"🌿 Life Vision",prompt:"Describe the life you are moving toward. What do your
