// app/api/products/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where = {}
    if (category) where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { badge: { contains: search, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error('[API Products GET Error]', error)
    return NextResponse.json({ success: false, products: [], error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      title,
      category,
      price,
      promoPrice,
      stock,
      unit,
      image,
      badge,
      description,
      features,
    } = body

    if (!title || price === undefined || !image) {
      return NextResponse.json(
        { error: 'Titre, prix et image sont obligatoires' },
        { status: 400 }
      )
    }

    let baseSlug = slugify(title)
    let finalSlug = baseSlug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter++}`
    }

    const product = await prisma.product.create({
      data: {
        title: title.trim(),
        slug: finalSlug,
        category: category || 'Provenderie & Nutrition',
        price: parseFloat(price),
        promoPrice: promoPrice ? parseFloat(promoPrice) : null,
        stock: stock ? parseInt(stock) : 0,
        inStock: stock ? parseInt(stock) > 0 : true,
        unit: unit || 'unité',
        image,
        badge: badge || null,
        description: description || '',
        features: Array.isArray(features) ? features : [],
      },
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    console.error('[API Products POST Error]', error)
    return NextResponse.json({ error: error.message || 'Erreur lors de la création du produit' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json({ error: 'ID du produit manquant' }, { status: 400 })
    }

    if (data.price !== undefined) data.price = parseFloat(data.price)
    if (data.promoPrice !== undefined) data.promoPrice = data.promoPrice ? parseFloat(data.promoPrice) : null
    if (data.stock !== undefined) {
      data.stock = parseInt(data.stock)
      data.inStock = data.stock > 0
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('[API Products PUT Error]', error)
    return NextResponse.json({ error: error.message || 'Erreur de mise à jour' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID du produit manquant' }, { status: 400 })
    }

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API Products DELETE Error]', error)
    return NextResponse.json({ error: error.message || 'Erreur de suppression' }, { status: 500 })
  }
}
