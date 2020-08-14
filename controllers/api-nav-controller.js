const apiNavController = () => {
  const getViews = async (req, res) => {
    const data = [
      {
        url: '/',
        methods: {
          GET: {
            desc: 'Get API views',
          },
        },
      },
      {
        url: '/api/v1.0.1/auth/create-user',
        methods: {
          POST: {
            desc: 'Admin can create an employee user account.',
          },
        },
      },
    ];
    return res.status(200).json(data);
  };

  return { getViews };
};

module.exports = apiNavController;
