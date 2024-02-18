import { ReactNode } from 'react'
import ActionButton from './ActionButton'
import PageTitle from './PageTitle'

interface Props {
  titleNameString: string
  selectItemObject: ReactNode
  tableColumnsObject: ReactNode
  tableDataObject: ReactNode
  register: any
  onClickAdd?: () => void
  handleOnChangeCategory?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  searchItemObject?: ReactNode | null
}

const ShowDataTemplate = ({
  titleNameString,
  selectItemObject,
  tableColumnsObject,
  tableDataObject,
  register,
  onClickAdd,
  handleOnChangeCategory,
  searchItemObject,
}: Props) => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <PageTitle titleName={titleNameString} />
          </div>
        </div>
        <div className="row p-2">
          <div className="col-12 align-bottom">
            Filter{' '}
            <select
              className="form-select-sm"
              name="checkSearchColumns"
              {...register('checkSearchColumns')}
              onChange={handleOnChangeCategory}
            >
              {selectItemObject}
            </select>{' '}
            {!searchItemObject && (
              <input
                type="input"
                className="form-control-sm"
                id="checkSearch"
                {...register('checkSearch')}
              />
            )}{' '}
            {searchItemObject && (
              <select
                className="form-select-sm"
                name="checkSearchItemObject"
                {...register('checkSearchItemObject')}
              >
                {searchItemObject}
              </select>
            )}{' '}
            <ActionButton
              buttonCaption="Search"
              buttonSize={15}
              buttonType="submit"
              showCaption={true}
              hideBorder={false}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <table className="table table-hover table-striped table-bordered">
              <thead>
                <tr className="text-center">
                  {tableColumnsObject}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">{tableDataObject}</tbody>
            </table>
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-6">
            <ActionButton
              buttonCaption="Add"
              buttonSize={15}
              showCaption={true}
              onClick={onClickAdd}
            />
          </div>
          <div className="col-6">
            <nav>
              <ul className="pagination pagination-sm justify-content-end">
                <li className="page-item disabled">
                  <a className="page-link">Previous</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShowDataTemplate
