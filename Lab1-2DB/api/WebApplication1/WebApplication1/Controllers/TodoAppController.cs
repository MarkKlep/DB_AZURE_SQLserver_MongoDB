using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Net.Sockets;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoAppController : ControllerBase
    {

        private IConfiguration _configuration;
        public TodoAppController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("GetNotes")]
        public JsonResult GetNotes()
        {
            string query = "select * from dbo.Notes";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }


        [HttpPost]
        [Route("AddNotes")]
        public JsonResult AddNotes([FromForm] string newNotes)
        {
            string query = "insert into dbo.Notes values(@newNotes)";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@newNotes", newNotes);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Added Successfully");
        }


        [HttpDelete]
        [Route("DeleteNotes")]
        public JsonResult DeleteNotes(int id)
        {
            string query = "delete from dbo.Notes where id=@id";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@id", id);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Deleted Successfully");
        }

        //table client 
        [HttpPost]
        [Route("AddClient")]
        public JsonResult AddClient([FromBody] ClientModel client)
        {
            string query = "INSERT INTO dbo.clients (surname, name, patronymic, address, phone) " +
                            "OUTPUT INSERTED.id " +
                            "VALUES (@Surname, @Name, @Patronymic, @Address, @Phone)";
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Surname", client.Surname);
                    myCommand.Parameters.AddWithValue("@Name", client.Name);
                    myCommand.Parameters.AddWithValue("@Patronymic", client.Patronymic);
                    myCommand.Parameters.AddWithValue("@Address", client.Address);
                    myCommand.Parameters.AddWithValue("@Phone", client.Phone);

                    int clientId = (int)myCommand.ExecuteScalar();

                    myCon.Close();

                    return new JsonResult(clientId);
                }
            }
        }

        //AddTicket
        [HttpPost]
        [Route("AddTicket")]
        public JsonResult AddTicket([FromBody] TicketModel ticket)
        {
            string query = "INSERT INTO dbo.ticket (id_route, id_client, departure_date, amount, discount, ticket_cost) " +
                             "OUTPUT INSERTED.id " +
                            "VALUES (@RouteId, @ClientId, @DepartureDate, @Amount, @Discount, @TicketCost)";
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@RouteId", ticket.RouteId);
                    myCommand.Parameters.AddWithValue("@ClientId", ticket.ClientId);
                    myCommand.Parameters.AddWithValue("@DepartureDate", ticket.DepartureDate);
                    myCommand.Parameters.AddWithValue("@Amount", ticket.Amount);
                    myCommand.Parameters.AddWithValue("@Discount", ticket.Discount);
                    myCommand.Parameters.AddWithValue("@TicketCost", ticket.TicketCost);

                    int ticketId = (int)myCommand.ExecuteScalar();

                    myCon.Close();

                    return new JsonResult(ticketId);
                }
            }
        }

        [HttpDelete]
        [Route("DeleteClient")]
        public JsonResult DeleteClient(int id)
        {
            string queryDeleteClientAndTickets = "DELETE FROM dbo.clients WHERE id = @id; " +
                                                  "DELETE FROM dbo.ticket WHERE id_client = @id";

            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();

                using (SqlCommand myCommandDeleteClientAndTickets = new SqlCommand(queryDeleteClientAndTickets, myCon))
                {
                    myCommandDeleteClientAndTickets.Parameters.AddWithValue("@id", id);
                    myCommandDeleteClientAndTickets.ExecuteNonQuery();
                }

                myCon.Close();
            }

            return new JsonResult("Client and related tickets deleted successfully");
        }


        //GetCleintOrders
        [HttpGet]
        [Route("GetClientOrders")]
        public JsonResult GetClientOrders(int clientId)
        {
            string query = $"SELECT * FROM dbo.clients LEFT JOIN [dbo].ticket ON dbo.ticket.id_client = dbo.clients.id WHERE dbo.ticket.id_client = {clientId};";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }
        //GetCleintRoutes
        [HttpGet]
        [Route("GetClientRoutes")]
        public JsonResult GetClientRoutes(int clientId)
        {
            string query = $"SELECT * FROM dbo.routse LEFT JOIN [dbo].ticket ON dbo.ticket.id_route = dbo.routse.id WHERE dbo.ticket.id_client = {clientId};";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        //GET ROUTSE FROM DB
        [HttpGet]
        [Route("GetRoutes")]
        public JsonResult GetRoutes()
        {
            string query = "select * from dbo.Routse";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        //CheckUser
        [HttpGet]
        [Route("CheckUser")]
        public JsonResult CheckUser(string address, string phone)
        {
            //string query = "SELECT * FROM dbo.clients WHERE Address = @address AND Phone = @phone";
            //string query = "SELECT * FROM [dbo].[clients] LEFT JOIN [dbo].[ticket] ON [dbo].[clients].id = [dbo].[ticket].id_client "
            string query = "SELECT * FROM [dbo].[clients] LEFT JOIN [dbo].[ticket] on [dbo].[clients].id = [dbo].[ticket].id_client "
                + "WHERE Address = @address AND Phone = @phone";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@address", address);
                    myCommand.Parameters.AddWithValue("@phone", phone);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        //DeleteClientOrder
        [HttpDelete]
        [Route("DeleteClientOrder")]
        public JsonResult DeleteClientOrder(int id)
        {
            string query = "DELETE FROM dbo.ticket WHERE dbo.ticket.id = @id";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@id", id);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Ticket Deleted Successfully");
        }

        [HttpPut]
        [Route("UpdateTicketDiscount")]
        public JsonResult UpdateTicketDiscount(int ticketId, decimal discount)
        {
            string query = "UPDATE dbo.ticket SET discount = @Discount WHERE id = @TicketId";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@Discount", discount);
                    myCommand.Parameters.AddWithValue("@TicketId", ticketId);
                    myCommand.ExecuteNonQuery();
                }
                myCon.Close();
            }
            return new JsonResult("Discount Updated Successfully");
        }

        //GetClients
        [HttpGet]
        [Route("GetClients")]
        public JsonResult GetClients()
        {
            string query = "SELECT * FROM dbo.clients";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        //AGREGATE FUNCTIONS
        //GetTicketCostCounts
        [HttpGet]
        [Route("GetTicketCostCounts")]
        public JsonResult GetTicketCostCounts()
        {
            string query = "SELECT [dbo].ticket.ticket_cost, COUNT([dbo].ticket.id) as ticket_count FROM [dbo].ticket GROUP BY [dbo].ticket.ticket_cost";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        //GetAverageTicketCost
        [HttpGet]
        [Route("GetAverageTicketCost")]
        public JsonResult GetAverageTicketCost()
        {
            string query = "SELECT AVG([dbo].ticket.ticket_cost) as average_cost FROM [dbo].ticket";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            if (table.Rows.Count > 0)
            {
                decimal averageCost = Convert.ToDecimal(table.Rows[0]["average_cost"]);
                return new JsonResult(averageCost);
            }
            else
            {
                return new JsonResult("No data found");
            }
        }

        //GetClientCount
        [HttpGet]
        [Route("GetClientCount")]
        public JsonResult GetClientCount()
        {
            string query = "SELECT COUNT(*) as client_count FROM [dbo].clients";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            if (table.Rows.Count > 0)
            {
                int clientCount = Convert.ToInt32(table.Rows[0]["client_count"]);
                return new JsonResult(clientCount);
            }
            else
            {
                return new JsonResult("No data found");
            }
        }

        //GetIncome
        [HttpGet]
        [Route("GetIncome")]
        public JsonResult GetIncome()
        {
            string query = "SELECT SUM(ticket_cost) as income FROM [dbo].[ticket]";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            if (table.Rows.Count > 0)
            {
                int clientCount = Convert.ToInt32(table.Rows[0]["income"]);
                return new JsonResult(clientCount);
            }
            else
            {
                return new JsonResult("No data found");
            }
        }

        //GetMaxPriceTicket
        [HttpGet]
        [Route("GetMaxPriceTicket")]
        public JsonResult GetMaxPriceTicket()
        {
            string query = "SELECT Max(ticket_cost) as MaxPrice FROM [dbo].[ticket]";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }

            if (table.Rows.Count > 0)
            {
                int clientCount = Convert.ToInt32(table.Rows[0]["MaxPrice"]);
                return new JsonResult(clientCount);
            }
            else
            {
                return new JsonResult("No data found");
            }
        }

        //Complex sql-----------------------------------

        //ClientsFilteredData
        [HttpGet]
        [Route("ClientsFilteredData")]
        public JsonResult GetClientsFilteredData(string categoryId)
        {
            string query = @"
            SELECT t.*, c.*, r.*
            FROM [dbo].[ticket] AS t
            JOIN [dbo].[clients] AS c ON t.id_client = c.id
            JOIN [dbo].[routse] AS r ON t.id_route = r.id
            WHERE (@CategoryId = '0' OR r.hotel = @CategoryId);";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@CategoryId", categoryId); 
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        //ClientsFilteredDataPrice
        [HttpGet]
        [Route("ClientsFilteredDataPrice")]
        public JsonResult GetClientsFilteredDataPrice(string categoryId)
        {
            string query = "SELECT * FROM [dbo].[ticket] AS t " +
                " JOIN [dbo].[clients] AS c ON t.id_client = c.id " +
                "JOIN [dbo].[routse] AS r ON t.id_route = r.id " +
                "WHERE (t.ticket_cost >= @CategoryId)";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@CategoryId", categoryId); 
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        //ClientsFilteredDataPriceAsc
        [HttpGet]
        [Route("ClientsFilteredDataPriceAsc")]
        public JsonResult GetClientsFilteredDataPriceAsc()
        {
            string query = "SELECT * FROM [dbo].[ticket] AS t " +
            "JOIN[dbo].[clients] AS c ON t.id_client = c.id " +
            "JOIN[dbo].[routse] AS r ON t.id_route = r.id " +
            "ORDER BY t.ticket_cost ASC;";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    //myCommand.Parameters.AddWithValue("@CategoryId", categoryId);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

        //ClientsFilteredDataPriceDesc
        [HttpGet]
        [Route("ClientsFilteredDataPriceDesc")]
        public JsonResult GetClientsFilteredDataPriceDesc()
        {
            string query = "SELECT * FROM [dbo].[ticket] AS t " +
            "JOIN[dbo].[clients] AS c ON t.id_client = c.id " +
            "JOIN[dbo].[routse] AS r ON t.id_route = r.id " +
            "ORDER BY t.ticket_cost DESC;";

            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("todoAppDBCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    //myCommand.Parameters.AddWithValue("@CategoryId", categoryId);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);
        }

    }
}
