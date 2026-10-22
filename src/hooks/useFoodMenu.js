import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchFoodMenu } from '../services/foodApi.js';
export default function useFoodMenu(){
 const [foods,setFoods]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [search,setSearch]=useState('');const [category,setCategory]=useState('All');
 const loadFoods=useCallback(async()=>{setLoading(true);setError('');try{const data=await fetchFoodMenu();setFoods(data)}catch(err){setFoods([]);setError(err instanceof Error?err.message:'Unable to load food menu. Check your internet connection.')}finally{setLoading(false)}},[]);
 useEffect(()=>{loadFoods()},[loadFoods]);
 const categories=useMemo(()=>['All',...new Set(foods.map(f=>f.category).filter(Boolean))],[foods]);
 const filteredFoods=useMemo(()=>foods.filter(f=>(f.name.toLowerCase().includes(search.toLowerCase())||f.description.toLowerCase().includes(search.toLowerCase()))&&(category==='All'||f.category===category)),[foods,search,category]);
 return {foods,filteredFoods,loading,error,search,setSearch,category,setCategory,categories,retry:loadFoods};
}
