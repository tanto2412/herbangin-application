interface Props {
  titleName: string
}

const PageTitle = ({ titleName }: Props) => {
  return (
    <>
      <h5>{titleName + ' '}</h5>
    </>
  )
}

export default PageTitle
