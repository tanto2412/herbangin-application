interface Props {
  itemID: number | null
  itemName: string | null
}

const DeleteScreenContent = ({ itemID, itemName }: Props) => {
  return (
    <>
      <div className="pb-5">
        <div>Apakah anda yakin untuk menghapus record ini?</div>
        <div>
          <br />
          ID: <b>{itemID}</b> <br />
          <b>{itemName}</b>
        </div>
      </div>
    </>
  )
}

export default DeleteScreenContent
