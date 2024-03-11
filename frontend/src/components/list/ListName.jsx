import React from "react";
import { Typography } from "@mui/material";

import PropTypes from "prop-types";

export default function ListName({ name }) {
	return <Typography variant="h6">{name}</Typography>;
}

ListName.propTypes = {
	name: PropTypes.string.isRequired,
};
