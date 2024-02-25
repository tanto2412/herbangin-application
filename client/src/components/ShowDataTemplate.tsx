import { ReactNode } from 'react'
import ActionButton from './ActionButton'
import PageTitle from './PageTitle'
import { NavLink } from 'react-router-dom'

interface Props {
  titleNameString: string
  selectItemObject: ReactNode
  tableColumnsObject: ReactNode
  tableDataObject: ReactNode
  register: any
  onClickAdd?: () => void
  handleOnChangeCategory?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  searchItemObject?: ReactNode | null
  pages?: number | undefined
  currentPage?: number | undefined
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
  pages = 0,
  currentPage = 1,
}: Props) => {
  return (
    <>
      <div className="container ms-0">
        <div className="row">
          <div className="col-12">
            <PageTitle titleName={titleNameString} />
          </div>
        </div>
        <div className="p-2 d-flex flex-row">
          <div className="d-inline-flex me-1 my-auto">Filter</div>
          <div className="d-inline-flex me-1">
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
          <div className="col-6">
            <nav>
              <ul className="pagination pagination-sm justify-content-end">
                <li className="page-item">
                  <NavLink
                    to={`${currentPage > 1 ? currentPage - 1 : 1}`}
                    className={({ isActive }) =>
                      (isActive ? 'disabled' : '') + ' page-link'
                    }
                  >
                    Previous
                  </NavLink>
                </li>
                {Array.from({ length: pages }, (_, index) => (
                  <NavLink
                    to={`./${index + 1}`}
                    key={index}
                    className="page-link"
                  >
                    {index + 1}
                  </NavLink>
                ))}
                <li className="page-item">
                  <NavLink
                    to={`./${pages}`}
                    className={({ isActive }) =>
                      (isActive ? 'disabled' : '') + ' page-link'
                    }
                  >
                    Next
                  </NavLink>
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
