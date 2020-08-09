const apiNavRouter = () => {
  const getViews = async (req, res) => {
    const data = [{
      url: '/',
      methods: {
        GET: {
          desc: 'Get API views',
        },
      },
    }];
    return res.status(200).json(data);
  };

  return { getViews };
};

module.exports = apiNavRouter;
