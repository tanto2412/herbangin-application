interface Props {
  itemID?: number | null
  itemName?: string | null
  actionString?: string
}

const DeleteScreenContent = ({
  itemID,
  itemName,
  actionString = 'menghapus record',
}: Props) => {
  return (
    <>
      <div className="pb-5">
        <div>Apakah anda yakin untuk {actionString} ini?</div>
        <div>
          <br />
          {itemID && (
            <>
              ID: <b>{itemID}</b> <br />
            </>
          )}
          {itemName && (
            <>
              <b>{itemName}</b>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default DeleteScreenContent
