

const addressModel = require("../models/address");
require('dotenv').config();
const { validationResult } = require("express-validator");
var mongoose = require('mongoose');
const authController = require('../controllers/auth');
const userModel = require("../models/user");

async function addAddress(req, res) {
    const { guest_id, house_no, street, city, postcode, instructions, appartment_name, floor, building_name, entry_code, business_name, hotel_name, business , address_type } = req.body;
    try {
        // Check if an address already exists for the given guest_id
        let existingAddress = await addressModel.findOne({ guest_id });

        if (existingAddress) {
            // Update the existing address
            existingAddress.address_type = address_type;
            existingAddress.house_no = house_no;
            existingAddress.street = street;
            existingAddress.city = city;
            existingAddress.postcode = postcode;
            existingAddress.instructions = instructions;
            existingAddress.appartment_name = appartment_name;
            existingAddress.floor = floor;
            existingAddress.building_name = building_name;
            existingAddress.entry_code = entry_code;
            existingAddress.business_name = business_name;
            existingAddress.hotel_name = hotel_name;
            existingAddress.business = business;

            const updatedAddress = await existingAddress.save();
            return res.status(200).json(updatedAddress);
        }

        // If no existing address, create a new user
        // const user = new userModel({
        //     name: email,
        //     email: email,
        //     password: email,
        //     role: 'user',
        // });

        // await user.save();
        // const savedUserId = user._id;

        // Save new address
        const newAddress = new addressModel({
            // user_id: savedUserId,
            guest_id,
            address_type,
            house_no,
            street,
            city,
            postcode,
            instructions,
            appartment_name,
            floor,
            building_name,
            entry_code,
            business_name,
            hotel_name,
            business
        });

        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function getAddress(req, res) {
    try {
        const { user_id } = req.params;
        const addresses = await addressModel.find({ user_id });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAddressByGuestId(req, res) {
    try {
        const { guest_id } = req.params;
        const addresses = await addressModel.find({ guest_id });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
    addAddress,
    getAddress,
    getAddressByGuestId
};
