import { Rectangle_6 } from '../ui/icon/Rectangle_6'

interface HeadingSectionAdminType {
  title: string
}

const HeadingSectionAdmin = ({ title }: HeadingSectionAdminType) => {
  return (
    <div className='flex items-center gap-3'>
      <Rectangle_6 className='w-7 h-7' />
      <h2 className='font-bold text-xl'>{title}</h2>
    </div>
  )
}

export default HeadingSectionAdmin
