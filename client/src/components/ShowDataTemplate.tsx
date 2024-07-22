import { ReactNode } from 'react'
import ActionButton from './ActionButton'
import PageTitle from './PageTitle'
import { NavLink } from 'react-router-dom'

interface Props {
  titleNameString: string
  selectItemObject: ReactNode | null
  tableColumnsObject: ReactNode
  tableDataObject: ReactNode
  register: any
  onClickAdd?: () => void
  handleOnChangeCategory?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  searchItemObject?: ReactNode | null
  pages?: number | undefined
  currentPage?: number | undefined
  backAction?: () => void
  additionalInfo?: string
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
  pages = 1,
  currentPage = 1,
  backAction,
  additionalInfo,
}: Props) => {
  const startPage = Math.max(currentPage - 3, 1)
  const endPage = Math.min(currentPage + 3, pages)
  console.log(currentPage)

  return (
    <>
      <div className="container ms-0">
        <div className="row">
          <div className="col-6">
            <PageTitle titleName={titleNameString} />
          </div>
          <div className="col-6 d-flex justify-content-end">
            {backAction && (
              <button
                className="btn btn-sm btn-outline-success mb-2"
                type="button"
                onClick={backAction}
              >
                Kembali
              </button>
            )}
          </div>
        </div>
        {selectItemObject != null && (
          <>
            <div className="p-2 d-flex flex-row ">
              <div className="d-inline-flex me-1 my-auto">Filter</div>
              <div className="d-inline-flex me-1 ">
                <select
                  className="form-select-sm"
                  name="checkSearchColumns"
                  {...register('checkSearchColumns')}
                  onChange={handleOnChangeCategory}
                >
                  {selectItemObject}
                </select>
              </div>
              {!searchItemObject && (
                <div className="d-inline-flex me-1">
                  <input
                    type="input"
                    className="form-control-sm"
                    id="checkSearch"
                    {...register('checkSearch')}
                  />
                </div>
              )}
              {searchItemObject && (
                <div className="d-inline-flex me-1">
                  <select
                    className="form-select-sm"
                    name="checkSearchItemObject"
                    {...register('checkSearchItemObject')}
                  >
                    {searchItemObject}
                  </select>
                </div>
              )}
              <div className="d-inline-flex me-1">
                <ActionButton
                  buttonCaption="Search"
                  buttonSize={15}
                  buttonType="submit"
                  showCaption={true}
                  hideBorder={false}
                />
              </div>
            </div>
          </>
        )}

        <div className="row">
          <div className="col-12">
            <table className="table table-hover table-striped table-bordered">
              <thead>
                <tr className="text-center">
                  {tableColumnsObject}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {tableDataObject}
                {tableDataObject != null &&
                  Object.keys(tableDataObject).length === 0 && (
                    <tr key={0}>
                      <td>Data kosong</td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>
        {additionalInfo && (
          <div>
            <b>{additionalInfo}</b>
          </div>
        )}
        <div className="row justify-content-between">
          <div className="col-6">
            {onClickAdd && (
              <ActionButton
                buttonCaption="Add"
                buttonSize={15}
                showCaption={true}
                onClick={onClickAdd}
              />
            )}
          </div>
          {pages && (
            <div className="col-6">
              <nav>
                <ul className="pagination pagination-sm justify-content-end">
                  <li className="page-item">
                    <NavLink
                      to={`./${currentPage - 1}`}
                      className={
                        'page-link ' + (currentPage === 1 ? 'disabled' : '')
                      }
                    >
                      Previous
                    </NavLink>
                  </li>
                  {startPage !== 1 && (
                    <li className="page-item">
                      <NavLink to={`./1`} key={1} className="page-link">
                        {1}
                      </NavLink>
                    </li>
                  )}
                  {startPage > 2 && (
                    <li className="page-item">
                      <div className="page-link">...</div>
                    </li>
                  )}
                  {Array.from(
                    { length: endPage - startPage + 1 },
                    (_, index) => {
                      const pageNum = startPage + index - 1
                      return (
                        <li className="page-item">
                          <NavLink
                            to={`./${pageNum + 1}`}
                            key={pageNum}
                            className="page-link"
                          >
                            {pageNum + 1}
                          </NavLink>
                        </li>
                      )
                    },
                  )}
                  {endPage < pages - 1 && (
                    <li className="page-item">
                      <div className="page-link">...</div>
                    </li>
                  )}
                  {endPage !== pages && (
                    <li className="page-item">
                      <NavLink
                        to={`./${pages}`}
                        key={pages}
                        className="page-link"
                      >
                        {pages}
                      </NavLink>
                    </li>
                  )}
                  <li className="page-item">
                    <NavLink
                      to={`./${currentPage + 1}`}
                      className={
                        'page-link ' + (currentPage === pages ? 'disabled' : '')
                      }
                    >
                      Next
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ShowDataTemplate
