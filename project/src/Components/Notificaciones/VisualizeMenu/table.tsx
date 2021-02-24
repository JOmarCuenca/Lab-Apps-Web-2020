import React, { FC, useState, useContext } from 'react';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { Product } from '../../../Constants/interfaces';
import editIcon     from "../../../Assets/img/edit.png";
import checkIcon    from "../../../Assets/img/check.png";
import cancelIcon   from "../../../Assets/img/cancel.png";
import { useHistory } from 'react-router-dom';
import { TableHead } from '@material-ui/core';
import { FirebaseContext } from '../../../API/Firebase';

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </div>
    );
}

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

interface Props {
    rows: Product[],
    setter : Function
}

export const ProductsTable: FC<Props> = (props) => {
    const classes = useStyles2();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.rows.length - page * rowsPerPage);
    const history = useHistory();
    const firebase = useContext(FirebaseContext);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleClickEditItem = (productId: string) => {
        history.push(`/dashboard/menu/${productId}`);
    };

    const renderMenuItem = (product: Product, key: number) => [
        <TableCell key={`Key${key}`} align="left">
            {key + 1}
        </TableCell>,
        <TableCell key={`img${key}`} component="th" scope="row" >
            <img alt="productImg" src={product.imageURL} style={{ maxWidth: "100%" }} height="60px" />
        </TableCell>,
        <TableCell key={`name${key}`} component="th" scope="row">
            {product.name}
        </TableCell>,
        <TableCell key={`price${key}`} component="th" scope="row">
            {product.price}
        </TableCell>,
        <TableCell key={`discount${key}`} component="th" scope="row">
            {product.discount ?? 0}{product.discount ? "%" : ""}
        </TableCell>,
        <TableCell key={`icon${key}`} component="th" scope="row">
            <img alt="activeIcon" style={{cursor : "pointer"}} onClick={(e) => {
                // firebase.changeProductStatus(product.id,product.active).then(() => {
                //     window.alert("El estado de este producto ha sido actualizado");
                //     props.setter("changed");
                // }).catch((e) => {
                //     console.log(e);
                //     window.alert("No se ha podido actualizar el estado de este producto");
                // });
            }} src={(product.active)?checkIcon:cancelIcon} width="30px" /> 
        </TableCell>,
        <TableCell key={`editicon${key}`} component="th" scope="row">
            <img alt="editIcon" style={{ cursor: "pointer" }} onClick={(e) => handleClickEditItem(product.id)} src={editIcon} width="20px" />
        </TableCell>
    ];

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: 50 }} >#</TableCell>
                        <TableCell style={{ width: 150 }} >Imagen</TableCell>
                        <TableCell style={{ width: 250 }} >Nombre</TableCell>
                        <TableCell >$ (MXN)</TableCell>
                        <TableCell >Descuento %</TableCell>
                        <TableCell >Estado Actual</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? props.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : props.rows
                    ).map((row, index) => (
                        <TableRow key={index}>
                            {renderMenuItem(row, index)}
                        </TableRow>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            count={props.rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
