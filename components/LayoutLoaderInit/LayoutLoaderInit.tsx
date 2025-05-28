"use client"
import { useLoader } from "@/context/LoaderContext/LoaderContext"
import { setLoaderContext } from "@/utils/api"
import { useEffect } from "react"

export default function LayoutLoaderInit() {
	const loader = useLoader()
	useEffect(() => { setLoaderContext(loader) }, [loader])
	return null
}