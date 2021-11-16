import React, { useEffect, useState } from 'react'
import { SPEC_LIST, SKU_LIST } from './constants'
import './sku.css'

export type SpecItem = {
  title: string
  list: { name: string; able: boolean }[]
}

const Sku: React.FC = () => {
  const [specList, setSpecList] = useState<SpecItem[]>([])
  const [selectedSpec, setSelectedSpec] = useState<{ [key: string]: string }>({})
  const [skuList] = useState(SKU_LIST)

  const isAble = (key: string, value: string) => {
    const copySelectSpec = { ...selectedSpec }
    copySelectSpec[key] = value
    let flag = skuList.some(item => {
      let i = 0
      for (let k in copySelectSpec) {
        if (copySelectSpec[k] !== '' && item.skus.includes(copySelectSpec[k])) {
          i++
        } else if (copySelectSpec[k] === '') {
          i++
        }
      }
      return i === specList.length
    })
    return flag
  }

  useEffect(() => {
    let specMap: { [key: string]: string } = {}
    SPEC_LIST.forEach(item => {
      specMap[item.title] = ''
    })

    const list = SPEC_LIST.map(item => {
      return {
        title: item.title,
        list: item.list.map(sku => {
          return {
            name: sku,
            // 判断是否可以选择
            able: isAble(item.title, sku)
          }
        })
      }
    })
    setSelectedSpec(specMap)
    setSpecList(list)
  }, [])

  const changeSpec = (key: string, value: string, able: boolean) => {
    if (!able) return
    if (selectedSpec[key] === value) {
      selectedSpec[key] = ''
    } else {
      selectedSpec[key] = value
    }

    const list = specList.map(v => {
      return {
        ...v,
        list: v.list.map(sku => {
          return {
            ...sku,
            able: isAble(v.title, sku.name)
          }
        })
      }
    })

    setSpecList(list)
  }

  return (
    <div>
      {specList.map((v, i) => (
        <div key={i}>
          <div className='title'>{v.title}</div>
          <div className='spec'>
            {v.list.map((sku, i) => (
              <div className='sku-item' key={sku.name + i}>
                <span
                  className={`${selectedSpec[v.title] === sku.name ? 'active' : ''} ${
                    !sku.able ? 'disabled' : ''
                  }`}
                  onClick={() => changeSpec(v.title, sku.name, sku.able)}
                >
                  {sku.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default React.memo(Sku)
