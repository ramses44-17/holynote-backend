

export const me = async (req, res) => {
    res.status(200).json(req.user)
}
