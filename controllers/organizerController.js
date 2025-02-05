const organizerService = require("../services/organizerService");

const create_organizer = async (req, res) => {
  try {
    const organizer = await organizerService.create_organizer(req.body);
    res.status(201).send(organizer);
  } catch (error) {
    res.status(400).send(error);
  }
};

const get_organizers = async (req, res) => {
  try {
    const organizers = await organizerService.get_organizers();
    res.send(organizers);
  } catch (error) {
    res.status(500).send(error);
  }
};

const get_organizer_by_id = async (req, res) => {
  try {
    const organizer = await organizerService.get_organizer_by_id(req.params.id);
    res.send(organizer);
  } catch (error) {
    res.status(404).send(error);
  }
};

const update_organizer = async (req, res) => {
  try {
    const organizer = await organizerService.update_organizer(
      req.params.id,
      req.body
    );
    res.send(organizer);
  } catch (error) {
    res.status(400).send(error);
  }
};

const manage_organizer_level = async (req, res) => {
  try {
    const organizer = await organizerService.manage_organizer_level(
      req.params.id,
      req.params.level
    );
    res.send(organizer);
  } catch (error) {
    res.status(400).send(error);
  }
};

const manage_organizer_status = async (req, res) => {
  try {
    const organizer = await organizerService.manage_organizer_status(
      req.params.id,
      req.params.status
    );
    res.send(organizer);
  } catch (error) {
    res.status(400).send(error);
  }
};

const change_phone = async (req, res) => {
  try {
    const organizer = await organizerService.change_phone(
      req.params.id,
      req.params.phone
    );
    res.send(organizer);
  } catch (error) {
    res.status(400).send(error);
  }
};

const change_email = async (req, res) => {
  try {
    const organizer = await organizerService.change_email(
      req.params.id,
      req.params.email
    );
    res.send(organizer);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  create_organizer,
  get_organizers,
  get_organizer_by_id,
  update_organizer,
  manage_organizer_level,
  manage_organizer_status,
  change_email,
  change_phone,
};
