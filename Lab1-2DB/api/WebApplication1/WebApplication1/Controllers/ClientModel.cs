namespace WebApplication1.Controllers
{
    public class ClientModel
    {
        public string Surname { get; set; }
        public string Name { get; set; }
        public string Patronymic { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
    }

    public class TicketModel
    {
        public int RouteId { get; set; }
        public int ClientId { get; set; }
        public string DepartureDate { get; set; }
        public int Amount { get; set; }
        public int Discount { get; set; }
        public int TicketCost { get; set; }
    }

}
